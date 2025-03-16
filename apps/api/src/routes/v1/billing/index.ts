import { OpenAPIHono } from '@hono/zod-openapi'
import { app as checkoutsRoutes } from './checkouts'
import { app as portalRoutes } from './portal'
import { app as productsRoutes } from './products'
import { app as subscriptionScheduleRoutes } from './subscription-schedule'
import { app as subscriptionsRoutes } from './subscriptions'
import type { Bindings } from '@/bindings'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/checkouts', checkoutsRoutes)
app.route('/portal', portalRoutes)
app.route('/products', productsRoutes)
app.route('/subscription-schedule', subscriptionScheduleRoutes)
app.route('/subscriptions', subscriptionsRoutes)
