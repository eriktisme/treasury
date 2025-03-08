import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '../../../../bindings'
import { SubscriptionSchema } from './schema'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

const get = createRoute({
  method: 'get',
  path: '/',
  summary: 'Subscription',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubscriptionSchema,
        },
      },
      description:
        "Retrieve the active subscription of the authenticated user's workspace",
    },
  },
})

app.openapi(get, async (c) => {
  return c.json(
    {
      data: null,
    },
    200
  )
})
