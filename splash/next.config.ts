import './src/env'
import type { NextConfig } from 'next'
import { config, withAnalyzer } from '@internal/next-config'
import './src/env'

let nextConfig: NextConfig = { ...config }

if (process.env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig)
}

export default nextConfig
