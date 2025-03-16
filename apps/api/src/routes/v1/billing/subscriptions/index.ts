import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { CreateSubscriptionBody, Subscription, SubscriptionsSchema } from '@internal/api-schema/billing'
import { getAuth } from '@hono/clerk-auth'
import { BadRequestErrorSchema, InternalErrorSchema, NotAuthorizedErrorSchema } from '@/shared/schema'
import {
  getCurrentStripeSubscriptionsByWorkspaceId,
  upsertStripeSubscription,
} from '@/data/stripe_subscriptions.queries'
import { z } from 'zod'
import { createPool } from '@vercel/postgres'
import { Stripe } from 'stripe'
import { getStripeCustomerByWorkspaceId } from '@/data/stripe_customers.queries'
import { getStripePriceByLookupKey } from '@/data/stripe_prices.queries'

const DEFAULT_TRIAL_PERIOD = 14

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

const get = createRoute({
  method: 'get',
  path: '/',
  summary: 'Subscriptions',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubscriptionsSchema,
        },
      },
      description:
        "Retrieve the active subscriptions of the authenticated user's workspace",
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

const post = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Subscription',
  request: {
    body: {
      content: {
        'application/json': { schema: CreateSubscriptionBody },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubscriptionsSchema,
        },
      },
      description:
        "Create a new subscription for the authenticated user's workspace",
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'Bad Request',
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

  const subscriptions = await getCurrentStripeSubscriptionsByWorkspaceId.run(
    {
      workspaceId: auth.orgId,
    },
    pool
  )

  if (subscriptions.length === 0) {
    return c.json(
      {
        data: [],
      },
      200
    )
  }

  const response = subscriptions.map((subscription) =>
    Subscription.safeParse({
      canceledAt: subscription.canceled_at,
      canceledAtPeriodEnd: subscription.canceled_at_period_end !== null,
      collectionMethod: 'charge_automatically',
      currentPeriod: {
        start: subscription.current_period_start,
        end: subscription.current_period_end,
      },
      seat: {
        customerId: subscription.customer_id,
        priceId: subscription.price_id,
        productId: subscription.product_id,
        quantity: subscription.quantity,
      },
      startedAt: subscription.created_at,
      status: subscription.status,
      subscriptionId: subscription.id,
      trial:
        subscription.trial_period_end !== null
          ? {
              start: subscription.trial_period_start,
              end: subscription.trial_period_end,
            }
          : null,
    })
  )

  const invalidSubscription = response.find((result) => !result.success)

  if (invalidSubscription) {
    console.error('Failed to parse subscription response', {
      error: invalidSubscription.error,
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
      data: response.map((result) => result.data) as Subscription[],
    },
    200
  )
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

  const [customer] = await getStripeCustomerByWorkspaceId.run({ workspaceId: auth.orgId }, pool)


  const body = c.req.valid('json')

  const [price] = await getStripePriceByLookupKey.run({key: body.lookupKey}, pool)

  if (!price) {
    return c.json({
      code: 'invalid_price',
      type: 'invalid_request_error',
      status_code: 400,
      request_id: lambdaContext.awsRequestId,
    }, 400)
  }

  const stripeSubscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: price.id,
      },
    ],
    trial_period_days: body.trial ? DEFAULT_TRIAL_PERIOD : undefined,
    trial_settings: body.trial ? {
      end_behavior: {
        missing_payment_method: 'cancel',
      }
    }: undefined,
  })

  if (!stripeSubscription) {
    return c.json({
      code: 'internal_error',
      type: 'internal_error',
      status_code: 500,
      request_id: lambdaContext.awsRequestId,
    }, 500)
  }

  const [subscription] =await upsertStripeSubscription.run(
    {
      subscription: {
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
        canceledAtPeriodEnd: stripeSubscription.cancel_at_period_end
          ? new Date(stripeSubscription.current_period_end * 1000)
          : null,
        createdAt: new Date(stripeSubscription.created * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        customerId: customer.id,
        id: stripeSubscription.id,
        metadata: stripeSubscription.metadata,
        priceId: stripeSubscription.items.data[0].price.id,
        quantity: stripeSubscription.items.data[0].quantity ?? 1,
        status: stripeSubscription.status,
        trialPeriodEnd: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000)
          : null,
        trialPeriodStart: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000)
          : null,
        workspaceId: customer.workspace_id,
      },
    },
    pool
  )

  if (!subscription) {
    return c.json({
      code: 'internal_error',
      type: 'internal_error',
      status_code: 500,
      request_id: lambdaContext.awsRequestId,
    }, 500)
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
      customerId: subscription.customer_id,
      priceId: subscription.price_id,
      productId: price.product_id,
      quantity: subscription.quantity,
    },
    startedAt: subscription.created_at,
    status: subscription.status,
    subscriptionId: subscription.id,
    trial:
      subscription.trial_period_end !== null
        ? {
            start: subscription.trial_period_start,
            end: subscription.trial_period_end,
          }
        : null,
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
      data: [response.data],
    },
    200
  )
})
