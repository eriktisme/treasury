import { OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '../../bindings'
import { app as clerkRoutes } from './clerk'
import { app as stripeRoutes } from './stripe'

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/clerk', clerkRoutes)
app.route('/stripe', stripeRoutes)
