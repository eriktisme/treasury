import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { getAuth } from '@hono/clerk-auth'
import {
  BadRequestErrorSchema,
  InternalErrorSchema,
  NotAuthorizedErrorSchema,
} from '@/shared/schema'
import type { IGetCurrentStripeSubscriptionsByWorkspaceIdResult } from '@/data/stripe_subscriptions.queries'
import { getCurrentStripeSubscriptionsByWorkspaceId } from '@/data/stripe_subscriptions.queries'
import { z } from 'zod'
import { createPool } from '@vercel/postgres'
import {
  CreateSubscriptionScheduleBody,
  SubscriptionSchedule,
  SubscriptionScheduleSchema,
} from '@internal/api-schema/billing'
import { Stripe } from 'stripe'
import type { IGetStripePriceByLookupKeyResult } from '@/data/stripe_prices.queries'
import { getStripePriceByLookupKey } from '@/data/stripe_prices.queries'

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
  summary: 'Subscription Schedule',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateSubscriptionScheduleBody,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubscriptionScheduleSchema,
        },
      },
      description:
        "Create a schedule for the existing subscription of the authenticated user's workspace",
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

  const [subscription] = await getCurrentStripeSubscriptionsByWorkspaceId.run(
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

  const body = c.req.valid('json')

  const [price] = await getStripePriceByLookupKey.run(
    {
      key: body.lookupKey,
    },
    pool
  )

  if (!price) {
    return c.json(
      {
        code: 'invalid_price',
        type: 'invalid_request_error',
        status_code: 400,
        request_id: lambdaContext.awsRequestId,
      },
      400
    )
  }

  const existingSubscription = await stripe.subscriptions.retrieve(
    subscription.id
  )

  if (body.direction === 'downgrade') {
    await handleDowngradingSubscription({
      existingSubscription,
      price,
      subscription,
    })
  } else {
    await handleUpgradingSubscription({
      existingSubscription,
      price,
      subscription,
    })
  }

  const response = SubscriptionSchedule.safeParse({
    subscriptionId: subscription.id,
  })

  if (!response.success) {
    console.error('Failed to parse subscription schedule response', {
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

interface HandleSubscriptionParams {
  existingSubscription: Stripe.Subscription
  price: IGetStripePriceByLookupKeyResult
  subscription: IGetCurrentStripeSubscriptionsByWorkspaceIdResult
}

async function handleDowngradingSubscription(params: HandleSubscriptionParams) {
  const quantity = params.existingSubscription.items.data[0].quantity ?? 1

  if (!params.existingSubscription.schedule) {
    await stripe.subscriptionSchedules.create({
      from_subscription: params.subscription.id,
      phases: [
        {
          items: params.existingSubscription.items.data.map((item) => ({
            price: item.price.id,
            quantity: item.quantity,
          })),
          end_date: params.existingSubscription.current_period_end,
        },
        {
          items: [{ price: params.price.id, quantity }],
        },
      ],
    })

    return
  }

  await stripe.subscriptionSchedules.update(
    typeof params.existingSubscription.schedule === 'string'
      ? params.existingSubscription.schedule
      : params.existingSubscription.schedule.id,
    {
      phases: [
        {
          items: params.existingSubscription.items.data.map((item) => ({
            price: item.price.id,
            quantity: item.quantity,
          })),
          start_date: 'now',
          end_date: params.existingSubscription.current_period_end,
        },
        {
          items: [{ price: params.price.id, quantity }],
        },
      ],
    }
  )
}

async function handleUpgradingSubscription(params: HandleSubscriptionParams) {
  const quantity = params.existingSubscription.items.data[0].quantity ?? 1

  if (!params.existingSubscription.schedule) {
    await stripe.subscriptionSchedules.create({
      from_subscription: params.subscription.id,
      phases: [
        {
          items: [{ price: params.price.id, quantity }],
          proration_behavior: 'create_prorations',
        },
      ],
    })

    return
  }

  await stripe.subscriptionSchedules.update(
    typeof params.existingSubscription.schedule === 'string'
      ? params.existingSubscription.schedule
      : params.existingSubscription.schedule.id,
    {
      phases: [
        {
          items: [{ price: params.price.id, quantity }],
          start_date: 'now',
          proration_behavior: 'create_prorations',
        },
      ],
    }
  )
}
