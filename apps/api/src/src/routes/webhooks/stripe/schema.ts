import { z } from '@hono/zod-openapi'

export const WebhookRequestSchema = z
  .object({
    data: z.record(z.string(), z.unknown()),
    id: z.string().openapi({
      example: 'evt_123',
      description: 'The ID of the the event that triggered the webhook.',
    }),
    type: z.string().openapi({
      examples: ['customer.created', 'customer.updated'],
      description: 'The type of event that triggered the webhook.',
    }),
    request: z.record(z.string(), z.unknown()).openapi({
      examples: [
        {
          id: null,
          idempotency_key: null,
        },
      ],
      description: 'Information on the API request that triggers the event.',
    }),
    api_version: z.string().openapi({
      examples: ['2019-02-19'],
      description: 'The version of the API that triggered the webhook.',
    }),
    livemode: z.boolean().openapi({
      examples: [true],
      description:
        'The indicator of whether the event occurred in live mode or test mode.',
    }),
    created: z.number().openapi({
      example: 1686089970,
      description: 'Timestamp in seconds of when the event occurred.',
    }),
    object: z.string().openapi({
      example: 'event',
      description: 'Always set to event.',
    }),
    account: z.string().openapi({
      example: 'ins_123',
      description: 'The identifier of your Stripe instance',
    }),
  })
  .catchall(z.unknown())
  .openapi('WebhookRequestSchema', {
    //
  })
