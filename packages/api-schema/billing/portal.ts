import { z } from '@hono/zod-openapi'

export const CreatePortalBodySchema = z.object({
  returnUrl: z.string().url(),
})

export type CreatePortalBody = z.infer<typeof CreatePortalBodySchema>

export const Portal = z.object({
  url: z.string().url().openapi({
    description:
      'The short-lived URL of the session that gives customers access to the customer portal.',
  }),
})

export const PortalSchema = z
  .object({
    data: Portal,
  })
  .openapi('PortalSchema')

export type PortalResponse = z.infer<typeof PortalSchema>
