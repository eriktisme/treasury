import type { ReactNode } from 'react'
import { PostHogProvider } from './posthog/client'

interface Props {
  children: ReactNode
}

export const AnalyticsProvider = ({ children }: Readonly<Props>) => (
  <PostHogProvider>{children}</PostHogProvider>
)
