'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import type { ReactNode } from 'react'

export const Providers = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: queryConfig,
        })
      }
    >
      {children}
    </QueryClientProvider>
  )
}
