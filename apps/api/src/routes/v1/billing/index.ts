import { OpenAPIHono } from '@hono/zod-openapi'
import { app as subscriptionsRoutes } from './subscriptions'
import type { Bindings } from '../../../bindings'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/subscriptions', subscriptionsRoutes)
