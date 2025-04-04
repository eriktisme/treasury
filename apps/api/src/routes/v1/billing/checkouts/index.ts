import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import {
  CheckoutSchema,
  Checkout,
  CreateCheckoutBodySchema,
} from '@internal/api-schema/billing'
import { getAuth } from '@hono/clerk-auth'
import {
  BadRequestErrorSchema,
  InternalErrorSchema,
  NotAuthorizedErrorSchema,
  NotFoundErrorSchema,
} from '@/shared/schema'
import { insertStripeCheckout } from '@/data/stripe_checkouts.queries'
import { z } from 'zod'
import { createPool } from '@vercel/postgres'
import { getStripePriceByLookupKey } from '@/data/stripe_prices.queries'
import { Stripe } from 'stripe'
import { getStripeCustomerByWorkspaceId } from '@/data/stripe_customers.queries'

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

const DEFAULT_TRIAL_PERIOD = 14

const post = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Checkout',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateCheckoutBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CheckoutSchema,
        },
      },
      description:
        "Retrieve a Stripe Checkout session by its session ID. The session must belong to the authenticated organization's workspace.",
    },
    401: {
      content: {
        'application/json': {
          schema: NotAuthorizedErrorSchema,
        },
      },
      description: 'Not Authorized',
    },
    400: {
      content: {
        'application/json': {
          schema: BadRequestErrorSchema,
        },
      },
      description: 'Bad Request',
    },
    404: {
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
      description: 'Not Found',
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

  const body = c.req.valid('json')

  const [customer] = await getStripeCustomerByWorkspaceId.run(
    {
      workspaceId: auth.orgId,
    },
    pool
  )

  if (!customer) {
    return c.json(
      {
        code: 'not_found',
        type: 'not_found_error',
        status_code: 404,
        request_id: lambdaContext.awsRequestId,
      },
      404
    )
  }

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

  const session = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    cancel_url: body.callbackUrl,
    customer: customer.id,
    line_items: [
      {
        price: price.id,
        quantity: body.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: body.quantity,
        },
      },
    ],
    mode: 'subscription',
    payment_method_types: ['card'],
    subscription_data: {
      trial_period_days: body.trial ? DEFAULT_TRIAL_PERIOD : undefined,
      trial_settings: body.trial
        ? {
            end_behavior: {
              missing_payment_method: 'cancel',
            },
          }
        : undefined,
    },
    success_url: body.callbackUrl,
    payment_method_collection: 'if_required',
  })

  if (!session) {
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

  const [checkout] = await insertStripeCheckout.run(
    {
      checkout: {
        createdAt: new Date(session.created * 1000),
        customerId: customer.id,
        metadata: session.metadata,
        mode: session.mode,
        priceId: price.id,
        sessionId: session.id,
        status: session.status ?? 'open',
        workspaceId: auth.orgId,
      },
    },
    pool
  )

  if (!checkout) {
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

  const response = Checkout.safeParse({
    sessionId: session.id,
    status: session.status ?? 'open',
    priceId: price.id,
    customerId: customer.id,
    mode: session.mode,
  })

  if (!response.success) {
    console.error('Failed to parse checkout response', {
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
