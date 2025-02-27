import middy from '@middy/core'
import { buildHandler } from './handler'

export const handler = middy(buildHandler)
