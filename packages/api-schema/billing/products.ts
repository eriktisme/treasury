import { z } from '@hono/zod-openapi'
import { Price } from './prices'

export const Product = z.object({
  name: z.string().openapi({
    description: 'The name of the product.',
    examples: ['Basic', 'Business', 'Enterprise'],
  }),
  prices: z.array(Price).openapi({
    description: 'The prices of the product.',
    examples: [],
  }),
  productId: z.string().openapi({
    description: 'The unique identifier of the product.',
    example: 'prod_RtvP9Fh5aO7dh6',
  }),
})

export type Product = z.infer<typeof Product>

export const ProductsSchema = z
  .object({
    data: z.array(Product),
  })
  .openapi('ProductsSchema')

export type ProductsResponse = z.infer<typeof ProductsSchema>
