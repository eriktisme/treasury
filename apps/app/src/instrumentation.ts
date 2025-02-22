import { initializeSentry } from '@internal/next-config/instrumentation'
import { env } from '@/env'

export const register = () => {
  initializeSentry({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  })
}
