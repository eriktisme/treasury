'use client'

import type { ReactNode } from 'react'
import { CurrentSubscriptionContext } from '@/context-store'
import { useAuth } from '@clerk/nextjs'
import { useQueries } from '@tanstack/react-query'
import {
  getProductOptions,
  getSubscriptionOptions,
  TrialExpiredDialog,
  UpgradeToPaidPlanDialog,
} from '@/features/workspace-billing'
import { queryConfig } from '@/lib/react-query'

export const Providers = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const { getToken } = useAuth()

  const [subscriptionQuery, productsQuery] = useQueries({
    queries: [
      {
        ...getSubscriptionOptions({
          getToken,
        }),
        ...queryConfig,
      },
      {
        ...getProductOptions({
          getToken,
        }),
        ...queryConfig,
      },
    ],
  })

  if (subscriptionQuery.isLoading || productsQuery.isLoading) {
    return null
  }

  return (
    <CurrentSubscriptionContext
      value={{
        currentSubscription: subscriptionQuery.data?.data?.at(0) ?? null,
        products: productsQuery.data?.data ?? [],
      }}
    >
      {children}
      <UpgradeToPaidPlanDialog />
      <TrialExpiredDialog />
    </CurrentSubscriptionContext>
  )
}
