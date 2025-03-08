import type { LambdaContext, LambdaEvent } from 'hono/aws-lambda'

export type Bindings = {
  event: LambdaEvent
  lambdaContext: LambdaContext
}
