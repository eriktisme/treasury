import './src/env'
import type { NextConfig } from 'next'
import { config, withAnalyzer, withSentry } from '@internal/next-config'
import { env } from '@/env'

let nextConfig: NextConfig = { ...config }

if (process.env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig)
}

if (process.env.VERCEL) {
  nextConfig = withSentry(nextConfig, {
    org: env.SENTRY_ORG,
    project: env.SENTRY_PROJECT,
    authToken: env.SENTRY_AUTH_TOKEN,
  })
}

export default nextConfig
