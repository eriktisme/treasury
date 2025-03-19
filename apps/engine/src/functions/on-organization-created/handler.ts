import type { EventBridgeEvent } from 'aws-lambda'
import { Stripe } from 'stripe'
import { z } from 'zod'
import type { OrganizationJSON } from '@clerk/backend'
import { createClerkClient } from '@clerk/backend'
import {
  getStripeCustomerByWorkspaceId,
  upsertStripeCustomer,
} from '@/data/stripe_customers.queries'
import { createPool } from '@vercel/postgres'
import { analytics } from '@internal/analytics/posthog/server'

const ConfigSchema = z.object({
  clerkSecretKey: z.string(),
  databaseUrl: z.string(),
  stripeSecretKey: z.string(),
})

const config = ConfigSchema.parse({
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
})

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
})

const clerk = createClerkClient({ secretKey: config.clerkSecretKey })

const pool = createPool({
  connectionString: config.databaseUrl,
  maxUses: 1,
})

export const buildHandler = async (
  event: EventBridgeEvent<'organization.created', OrganizationJSON>
) => {
  const [stripeCustomer] = await getStripeCustomerByWorkspaceId.run(
    {
      workspaceId: event.detail.id,
    },
    pool
  )

  if (stripeCustomer) {
    return
  }

  const createdBy = event.detail.created_by
    ? await clerk.users.getUser(event.detail.created_by)
    : null

  const customer = await stripe.customers.create({
    metadata: {
      organizationId: event.detail.id,
    },
    name: event.detail.name,
  })

  analytics.capture({
    event: 'Stripe Customer Created',
    distinctId: event.detail.id,
  })

  await clerk.organizations.updateOrganization(event.detail.id, {
    privateMetadata: {
      stripeCustomerId: customer.id,
    },
  })

  await upsertStripeCustomer.run(
    {
      customer: {
        email: createdBy?.emailAddresses?.at(0)?.emailAddress ?? '',
        id: customer.id,
        name: event.detail.name,
        workspaceId: event.detail.id,
      },
    },
    pool
  )

  await analytics.shutdown()
}
