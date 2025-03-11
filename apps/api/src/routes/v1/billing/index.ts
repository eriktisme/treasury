import { OpenAPIHono } from '@hono/zod-openapi'
import { app as checkoutsRoutes } from './checkouts'
import { app as portalRoutes } from './portal'
import { app as subscriptionsRoutes } from './subscriptions'
import type { Bindings } from '@/bindings'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/checkouts', checkoutsRoutes)
app.route('/portal', portalRoutes)
app.route('/subscriptions', subscriptionsRoutes)
