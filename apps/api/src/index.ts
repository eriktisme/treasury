import { OpenAPIHono } from '@hono/zod-openapi'
import { handle } from 'hono/aws-lambda'
import { secureHeaders } from 'hono/secure-headers'
import type { Bindings } from './bindings'
import { app as v1Routes } from './routes/v1'
import { app as webhooksRoutes } from './routes/webhooks'
import { app as healthRoutes } from './routes/health'
import { swaggerUI } from '@hono/swagger-ui'
import { z } from 'zod'
import { cors } from 'hono/cors'

const ConfigSchema = z.object({
  domainName: z.string(),
})

const config = ConfigSchema.parse({
  domainName: process.env.DOMAIN_NAME,
})

const app = new OpenAPIHono<{ Bindings: Bindings }>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ success: false, errors: result.error.errors }, 422)
    }

    return c.json({ success: true }, 200)
  },
})

app.use(secureHeaders())

app.use('*', (c, next) => {
  const corsMiddleware = cors({
    allowHeaders: [
      'Authorization',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
    ],
    credentials: true,
    maxAge: 600,
    origin: c.req.header('Origin') ?? `https://app.${config.domainName}`,
  })

  return corsMiddleware(c, next)
})

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
})

app.get(
  '/',
  swaggerUI({
    url: '/openapi',
  })
)

app.doc('/openapi', {
  openapi: '3.1.0',
  info: {
    version: '0.1.0',
    title: 'Connect-CRM API',
  },
})

app.route('/health', healthRoutes)
app.route('/webhooks', webhooksRoutes)
app.route('v1', v1Routes)

export const handler = handle(app)
