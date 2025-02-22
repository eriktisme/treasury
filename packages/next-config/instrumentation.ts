import { init } from '@sentry/nextjs'
import type { BrowserOptions } from '@sentry/react'

export const initializeSentry = (opts: BrowserOptions) => {
  if (process.env.TURBOPACK) {
    return
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    init({
      ...opts,
      dsn: opts.dsn,
      debug: false,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    init({
      ...opts,
      dsn: opts.dsn,
      debug: false,
    })
  }
}
