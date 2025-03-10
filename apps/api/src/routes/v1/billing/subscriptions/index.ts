import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { Subscription, SubscriptionSchema } from '@internal/api-schema/billing'
import { getAuth } from '@hono/clerk-auth'
import { InternalErrorSchema, NotAuthorizedErrorSchema } from '@/shared/schema'
import { getStripeSubscriptionByWorkspaceId } from '@/data/stripe_subscriptions.queries'
import { z } from 'zod'
import { createPool } from '@vercel/postgres'

const ConfigSchema = z.object({
  databaseUrl: z.string(),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
})

const pool = createPool({
  connectionString: config.databaseUrl,
  maxUses: 1,
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const get = createRoute({
  method: 'get',
  path: '/',
  summary: 'Subscription',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubscriptionSchema,
        },
      },
      description:
        "Retrieve the active subscription of the authenticated user's workspace",
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

app.openapi(get, async (c) => {
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

  const [subscription] = await getStripeSubscriptionByWorkspaceId.run(
    {
      workspaceId: auth.orgId,
    },
    pool
  )

  if (!subscription) {
    return c.json(
      {
        data: null,
      },
      200
    )
  }

  const response = Subscription.safeParse({
    canceledAt: subscription.canceled_at,
    canceledAtPeriodEnd: subscription.canceled_at_period_end !== null,
    collectionMethod: 'charge_automatically',
    currentPeriod: {
      start: subscription.current_period_start,
      end: subscription.current_period_end,
    },
    seat: {
      productId: subscription.product_id,
      priceId: subscription.price_id,
      quantity: subscription.quantity,
    },
    startedAt: subscription.created_at,
    status: subscription.status,
    subscriptionId: subscription.id,
    trial: {
      start: subscription.trial_period_start,
      end: subscription.trial_period_end,
    },
  })

  if (!response.success) {
    console.error('Failed to parse subscription response', {
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
