import { z } from '@hono/zod-openapi'

export const Price = z.object({
  priceId: z.string().openapi({
    description: 'The unique identifier of the price.',
    example: 'price_1J0PqX2eZvKYlo2CzQ6JwXbL',
  }),
  unit: z.object({
    amount: z.number().nullable().openapi({
      description: 'The amount in cents.',
      example: 1000,
    }),
    currency: z.string().nullable().openapi({
      description: 'The currency of the amount.',
      example: 'eur',
    }),
  }),
  recurring: z.object({
    interval: z.string().nullable().openapi({
      description: 'The interval of the recurring price.',
      example: 'month',
    }),
    intervalCount: z.number().nullable().openapi({
      description: 'The interval count of the recurring price.',
      example: 1,
    }),
  }),
  lookupKey: z
    .string()
    .nullable()
    .openapi({
      description: 'The lookup key of the price.',
      examples: ['basic_monthly', 'basic_yearly'],
    }),
})

export type Price = z.infer<typeof Price>
