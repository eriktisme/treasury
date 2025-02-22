import { z } from '@hono/zod-openapi'

export const WebhookRequestSchema = z
  .object({
    data: z.record(z.string(), z.unknown()),
    type: z.string().openapi({
      examples: ['user.created', 'user.updated'],
      description: 'The type of event that triggered the webhook.',
    }),
    timestamp: z.number().openapi({
      example: 1654012591835,
      description: 'Timestamp in milliseconds of when the event occurred.',
    }),
    object: z.string().openapi({
      example: 'event',
      description: 'Always set to event.',
    }),
    instance_id: z.string().openapi({
      example: 'ins_123',
      description: 'The identifier of your Clerk instance',
    }),
  })
  .catchall(z.unknown())
  .openapi('WebhookRequestSchema', {
    //
  })
