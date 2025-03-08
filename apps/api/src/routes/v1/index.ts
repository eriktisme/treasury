import { OpenAPIHono } from '@hono/zod-openapi'
import type { Bindings } from '../../bindings'
import { clerkMiddleware } from '@hono/clerk-auth'
import { z } from 'zod'
import { cors } from 'hono/cors'

const ConfigSchema = z.object({
  clerkSecretKey: z.string(),
  clerkPublishableKey: z.string(),
})

const config = ConfigSchema.parse({
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
})

export const app = new OpenAPIHono<{ Bindings: Bindings }>()

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
    origin: '*',
    allowHeaders: [
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
    exposeHeaders: [],
    maxAge: 600,
    credentials: true,
  })
)
