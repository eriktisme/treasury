import { z } from '@hono/zod-openapi'

export const GetCheckoutParamsSchema = z.object({
  sessionId: z.string().openapi({
    description: 'A unique identifier for the checkout session.',
    example: '123e4567-e89b-12d3-a456-426614174001',
  }),
})

export const Checkout = z.object({
  sessionId: z.string().openapi({
    description: 'The unique identifier for the checkout.',
    example: '123e4567-e89b-12d3-a456-426614174001',
  }),
  priceId: z.string().openapi({
    description: 'The unique identifier for the price.',
    example: 'price_1R07gAJxehjHwVZTRxpJtiDK',
  }),
  customerId: z.string().openapi({
    description: 'The unique identifier for the customer.',
    example: 'cus_RtvP9Fh5aO7dh6',
  }),
  status: z.string().openapi({
    description: 'The current status of the checkout.',
    examples: ['open', 'complete', 'expired'],
  }),
  mode: z.string().openapi({
    description: 'The mode of the checkout session',
    examples: ['subscription'],
  }),
})

export const CheckoutSchema = z
  .object({
    data: Checkout,
  })
  .openapi('CheckoutSchema')

export const CreateCheckoutBodySchema = z.object({
  priceId: z.string().openapi({
    description: 'The unique identifier for the price.',
    example: 'price_1R07gAJxehjHwVZTRxpJtiDK',
  }),
  quantity: z.number().positive().openapi({
    description: 'The amount of the product to purchase.',
    example: 1,
  }),
  callbackUrl: z.string().openapi({
    description: 'The URL to redirect to after the checkout is complete.',
    example: 'https://example.com/checkout/success',
  }),
})
