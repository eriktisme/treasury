import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { Price, Product, ProductsSchema } from '@internal/api-schema/billing'
import { getAuth } from '@hono/clerk-auth'
import { InternalErrorSchema, NotAuthorizedErrorSchema } from '@/shared/schema'
import { z } from 'zod'
import { createPool } from '@vercel/postgres'
import { getStripeProductsWithPricesByStatus } from '@/data/stripe_products.queries'
import { getStripePriceByProductIds } from '@/data/stripe_prices.queries'

const ConfigSchema = z.object({
  databaseUrl: z.string(),
})

const config = ConfigSchema.parse({
  databaseUrl: process.env.DATABASE_URL,
})

const pool = createPool({
  connectionString: config.databaseUrl,
  maxUses: 1,
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const get = createRoute({
  method: 'get',
  path: '/',
  summary: 'Products',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ProductsSchema,
        },
      },
      description:
        'Retrieve a list of active products and their prices. The products are used to create subscriptions. The prices are used to create subscriptions and to display the pricing information to the user. The prices are sorted by the `unit_amount` in ascending order.',
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

  const products = await getStripeProductsWithPricesByStatus.run(
    {
      active: true,
    },
    pool
  )

  const prices = await getStripePriceByProductIds.run(
    {
      productIds: products
        .filter(Boolean)
        .map((product) => product.id) as string[],
    },
    pool
  )

  const response = products.map((product) => {
    const productPrices = prices
      .filter((price) => price.product_id === product.id)
      .map((price) => {
        return Price.safeParse({
          priceId: price.id,
          unit: {
            amount: price.unit_amount,
            currency: price.currency,
          },
          recurring: {
            interval: price.recurring_interval,
            intervalCount: price.recurring_count,
          },
          lookupKey: price.lookup_key,
        })
      })

    const invalidPrice = productPrices.find((result) => !result.success)

    if (invalidPrice) {
      return invalidPrice
    }

    return Product.safeParse({
      productId: product.id!,
      name: product.name!,
      prices: productPrices.map((result) => result.data),
    })
  })

  const invalidProduct = response.find((result) => !result.success)

  if (invalidProduct) {
    console.error('Failed to parse products response', {
      error: invalidProduct.error,
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
      data: response.map((result) => result.data) as Product[],
    },
    200
  )
})
