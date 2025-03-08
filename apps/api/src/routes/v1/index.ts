import { OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '@/bindings'
import { clerkMiddleware } from '@hono/clerk-auth'
import { z } from 'zod'
import { cors } from 'hono/cors'
import { app as billingRoutes } from './billing'

const ConfigSchema = z.object({
  clerkSecretKey: z.string(),
  clerkPublishableKey: z.string(),
})

const config = ConfigSchema.parse({
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.route('/billing', billingRoutes)

app.use(
  '*',
  clerkMiddleware({
    secretKey: config.clerkSecretKey,
    publishableKey: config.clerkPublishableKey,
  })
)

app.use(
  '*',
  cors({
    allowHeaders: [
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
    credentials: true,
    exposeHeaders: [],
    maxAge: 600,
    origin: '*',
  })
)
