import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { getAuth } from '@hono/clerk-auth'
import { InternalErrorSchema, NotAuthorizedErrorSchema } from '@/shared/schema'
import { z } from 'zod'
import { Stripe } from 'stripe'
import {
  CreatePortalBodySchema,
  Portal,
  PortalSchema,
} from '@internal/api-schema/billing/portal'
import { getStripeCustomerByWorkspaceId } from '@/data/stripe_customers.queries'
import { createPool } from '@vercel/postgres'

const ConfigSchema = z.object({
  databaseUrl: z.string(),
  stripeSecretKey: z.string(),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
})

const pool = createPool({
  connectionString: config.databaseUrl,
  maxUses: 1,
})

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const post = createRoute({
  method: 'post',
  path: '/',
  summary: 'Billing Portal',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePortalBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PortalSchema,
        },
      },
      description:
        'Retrieve a short-lived URL that customers can use to manage their subscription.',
    },
    401: {
      content: {
        'application/json': {
          schema: NotAuthorizedErrorSchema,
        },
      },
      description: 'Not Authorized',
    },
    500: {
      content: {
        'application/json': {
          schema: InternalErrorSchema,
        },
      },
      description: 'Internal Error',
    },
  },
})

app.openapi(post, async (c) => {
  const auth = getAuth(c)
  const lambdaContext = c.env.lambdaContext

  if (!auth || !auth.orgId) {
    return c.json(
      {
        code: 'not_authorized',
        type: 'not_authorized_error',
        status_code: 401,
        request_id: lambdaContext.awsRequestId,
      },
      401
    )
  }

  const [customer] = await getStripeCustomerByWorkspaceId.run(
    {
      workspaceId: auth.orgId,
    },
    pool
  )

  if (!customer) {
    return c.json(
      {
        code: 'internal_error',
        type: 'internal_error',
        status_code: 500,
        request_id: lambdaContext.awsRequestId,
      },
      500
    )
  }

  const body = c.req.valid('json')

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: body.returnUrl,
  })

  const response = Portal.safeParse({
    url: session.url,
  })

  if (!response.success) {
    console.error('Failed to parse portal response', {
      error: response.error,
    })

    return c.json(
      {
        code: 'internal_error',
        type: 'internal_error',
        status_code: 500,
        request_id: lambdaContext.awsRequestId,
      },
      500
    )
  }

  return c.json(
    {
      data: response.data,
    },
    200
  )
})
