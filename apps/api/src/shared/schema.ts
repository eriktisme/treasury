import { z } from '@hono/zod-openapi'

export const InternalErrorSchema = z.object({
  status_code: z.number().openapi({
    example: 500,
  }),
  type: z.string().openapi({
    example: 'internal_error',
  }),
  code: z.string().openapi({
    example: 'internal_error',
  }),
  request_id: z.string().openapi({
    example: '123e4567-e89b-12d3-a456-426655440000',
  }),
})

export const NotFoundErrorSchema = z.object({
  status_code: z.number().openapi({
    example: 404,
  }),
  type: z.string().openapi({
    example: 'invalid_request_error',
  }),
  code: z.string().openapi({
    example: 'not_found',
  }),
  request_id: z.string().openapi({
    example: '123e4567-e89b-12d3-a456-426655440000',
  }),
})

export const NotAuthorizedErrorSchema = z.object({
  status_code: z.number().openapi({
    example: 404,
  }),
  type: z.string().openapi({
    example: 'not_authorized_error',
  }),
  code: z.string().openapi({
    example: 'not_authorized',
  }),
  request_id: z.string().openapi({
    example: '123e4567-e89b-12d3-a456-426655440000',
  }),
})

export const ConflictErrorSchema = z.object({
  status_code: z.number().openapi({
    example: 409,
  }),
  type: z.string().openapi({
    example: 'invalid_request_error',
  }),
  code: z.string().openapi({
    example: '',
  }),
  request_id: z.string().openapi({
    example: '123e4567-e89b-12d3-a456-426655440000',
  }),
})

export const BadRequestErrorSchema = z.object({
  status_code: z.number().openapi({
    example: 400,
  }),
  type: z.string().openapi({
    example: 'invalid_request_error',
  }),
  code: z.string().openapi({
    example: 'validation_type',
  }),
  request_id: z.string().openapi({
    example: '123e4567-e89b-12d3-a456-426655440000',
  }),
})
