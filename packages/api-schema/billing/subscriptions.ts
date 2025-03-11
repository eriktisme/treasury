import { z } from '@hono/zod-openapi'

export const Subscription = z.object({
  subscriptionId: z.string().openapi({
    description: 'The unique identifier for the workspace subscription.',
    example: 'sub_1R0lVhJxehjHwVZTqVp7i9XP',
  }),
  status: z.string().openapi({
    description: 'The status of the subscription.',
    examples: [
      'trialing',
      'active',
      'canceled',
      'past_due',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused',
    ],
  }),
  collectionMethod: z.string().openapi({
    description: 'The method of collection for the subscription.',
    examples: ['charge_automatically', 'send_invoice'],
  }),
  currentPeriod: z
    .object({
      start: z.date().openapi({
        description: 'The start date of the current period.',
        example: '2023-01-01T00:00:00Z',
      }),
      end: z.date().openapi({
        description: 'The end date of the current period.',
        example: '2023-12-31T23:59:59Z',
      }),
    })
    .openapi({
      description: 'The current billing period for the subscription.',
    }),
  seat: z
    .object({
      productId: z.string().openapi({
        description: 'The unique identifier for the product.',
        example: 'prod_RtvP9Fh5aO7dh6',
      }),
      priceId: z.string().openapi({
        description: 'The unique identifier for the price.',
        example: 'price_1R07gAJxehjHwVZTRxpJtiDK',
      }),
      customerId: z.string().openapi({
        description: 'The unique identifier for the customer.',
        example: 'cus_1R07gAJxehjHwVZTRxpJtiDK',
      }),
      quantity: z.number().int().openapi({
        description: 'The quantity of seats.',
        example: 5,
      }),
    })
    .openapi({
      description: 'Details about the seat allocation for the subscription.',
    }),
  trial: z
    .object({
      start: z.date().nullable().openapi({
        description: 'The start date of the trial period.',
        example: '2023-01-01T00:00:00Z',
      }),
      end: z.date().nullable().openapi({
        description: 'The end date of the trial period.',
        example: '2023-01-31T23:59:59Z',
      }),
    })
    .openapi({
      description: 'The trial period for the subscription, if applicable.',
    }),
  canceledAtPeriodEnd: z.boolean().openapi({
    description:
      'Indicates if the subscription is canceled at the end of the period.',
    example: false,
  }),
  startedAt: z.date().openapi({
    description: 'The start date of the subscription.',
    example: '2023-01-01T00:00:00Z',
  }),
  canceledAt: z.date().nullable().openapi({
    description: 'The date when the subscription was canceled, if applicable.',
    example: '2023-06-01T00:00:00Z',
  }),
})

export const SubscriptionSchema = z
  .object({
    data: z.union([Subscription, z.null()]),
  })
  .openapi('SubscriptionSchema')

export type SubscriptionResponse = z.infer<typeof SubscriptionSchema>
