import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { WebhookRequestSchema } from './schema'
import type { Bindings } from '../../../bindings'
import { analytics } from '@internal/analytics/posthog/server'
import { z } from 'zod'
import { Stripe } from 'stripe'

const ConfigSchema = z.object({
  stripeWebhookSecret: z.string(),
  stripeSecretKey: z.string(),
})

const config = ConfigSchema.parse({
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
})

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
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

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      await request.text(),
      request.header('Stripe-Signature') as string,
      config.stripeWebhookSecret
    )
  } catch (err) {
    console.error('Failed to construct stripe event', {
      err,
    })

    return c.json({ ok: false }, 500)
  }

  if (!stripeEvent) {
    return c.json({ ok: false }, 500)
  }

  switch (stripeEvent.type) {
    default: {
      break
    }
  }

  await analytics.shutdown()

  return c.json(
    {
      ok: true,
    },
    200
  )
})
