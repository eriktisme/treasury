import { z } from 'zod'
import { buildHandler } from './handler'
import type { MigrationEvent } from './types'
import type { Context } from 'aws-lambda'

const ConfigSchema = z.object({
  connectionString: z.string(),
})

const config = ConfigSchema.parse({
  connectionString: process.env.POSTGRESS_URL,
})

export const handler = (event: MigrationEvent, context: Context) =>
  buildHandler(event, context, {
    connectionString: config.connectionString,
  })
