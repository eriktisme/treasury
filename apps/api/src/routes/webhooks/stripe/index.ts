import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { WebhookRequestSchema } from './schema'
import type { Bindings } from '@/bindings'
import { analytics } from '@internal/analytics/posthog/server'
import { z } from 'zod'
import { Stripe } from 'stripe'
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge'
import {
  deleteStripeProduct,
  upsertStripeProduct,
} from '@/data/stripe_products.queries'
import { createPool } from '@vercel/postgres'
import {
  deleteStripePrice,
  upsertStripePrice,
} from '@/data/stripe_prices.queries'
import { upsertStripeSubscription } from '@/data/stripe_subscriptions.queries'
import { getStripeCustomerById } from '@/data/stripe_customers.queries'

const ConfigSchema = z.object({
  databaseUrl: z.string(),
  eventBusName: z.string(),
  stripeSecretKey: z.string(),
  stripeWebhookSecret: z.string(),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
  eventBusName: process.env.EVENT_BUS_NAME,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
})

const eventBridgeClient = new EventBridgeClient()

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
})

const pool = createPool({
  connectionString: config.databaseUrl,
  maxUses: 1,
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const post = createRoute({
  method: 'post',
  path: '/',
  summary: 'Process Stripe events',
  request: {
    body: {
      content: {
        'application/json': { schema: WebhookRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
          }),
        },
      },
      description: 'Processed real-time event produced by Stripe',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
          }),
        },
      },
      description: 'Failed processing the real-time event produced by Stripe',
    },
  },
})

app.openapi(post, async (c) => {
  const request = c.req

  let stripeEvent: Stripe.Event | null = null

  const body = request.valid('json')

  /*
   * Verify the event by fetching it from Stripe
   *
   * This is a workaround for the Hono API not supporting access to the raw body
   */
  try {
    stripeEvent = await stripe.events.retrieve(body.id)
  } catch (e) {
    console.error('Failed to retrieve stripe event', {
      e,
    })

    return c.json({ ok: false }, 500)
  }

  if (!stripeEvent) {
    return c.json({ ok: false }, 500)
  }

  switch (stripeEvent.type) {
    case 'product.created':
    case 'product.updated': {
      await handleCreateOrUpdateStripeProduct(stripeEvent.data.object)

      break
    }
    case 'product.deleted': {
      await handleDeletingStripeProduct(stripeEvent.data.object)

      break
    }
    case 'price.created':
    case 'price.updated': {
      await handleCreateOrUpdateStripePrice(stripeEvent.data.object)

      break
    }
    case 'price.deleted': {
      await handleDeletingStripePrice(stripeEvent.data.object)

      break
    }
    case 'customer.subscription.updated': {
      await handleCreateOrUpdateStripeSubscription(stripeEvent.data.object)

      break
    }
    default: {
      break
    }
  }

  await analytics.shutdown()

  await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify(stripeEvent.data.object),
          DetailType: stripeEvent.type,
          EventBusName: config.eventBusName,
          Source: 'stripe',
          Time: new Date(),
        },
      ],
    })
  )

  return c.json(
    {
      ok: true,
    },
    200
  )
})

async function handleDeletingStripeProduct(product: Stripe.Product) {
  await deleteStripeProduct.run({ id: product.id }, pool)
}

async function handleCreateOrUpdateStripeProduct(product: Stripe.Product) {
  await upsertStripeProduct.run(
    {
      product: {
        active: product.active,
        description: product.description,
        id: product.id,
        metadata: product.metadata,
        name: product.name,
      },
    },
    pool
  )
}

async function handleCreateOrUpdateStripePrice(price: Stripe.Price) {
  await upsertStripePrice.run(
    {
      price: {
        active: price.active,
        currency: price.currency,
        id: price.id,
        metadata: price.metadata,
        productId: price.product as string,
        recurringCount: price.recurring?.interval_count,
        recurringInterval: price.recurring?.interval,
        unitAmount: price.unit_amount,
      },
    },
    pool
  )
}

async function handleDeletingStripePrice(price: Stripe.Price) {
  await deleteStripePrice.run({ id: price.id }, pool)
}

async function handleCreateOrUpdateStripeSubscription(
  subscription: Stripe.Subscription
) {
  const [customer] = await getStripeCustomerById.run(
    { id: subscription.customer as string },
    pool
  )

  if (!customer) {
    // TODO: Think about how to report & handle errors

    return
  }

  await upsertStripeSubscription.run(
    {
      subscription: {
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        canceledAtPeriodEnd: subscription.cancel_at_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
        createdAt: new Date(subscription.created * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        customerId: customer.id,
        id: subscription.id,
        metadata: subscription.metadata,
        priceId: subscription.items.data[0].price.id,
        quantity: subscription.items.data[0].quantity ?? 1,
        status: subscription.status,
        trialPeriodEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        trialPeriodStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : null,
        workspaceId: customer.workspaceId,
      },
    },
    pool
  )
}
