'use client'

import Link from 'next/link'
import { getSubscriptionOptions } from '../api'
import { useQuery } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import { Button } from '@internal/design-system/components/ui/button'
import { ArrowUpRightIcon } from 'lucide-react'
import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'

export const WorkspaceBillingPlansPageTemplate = () => {
  const { getToken } = useAuth()

  const { data, isLoading } = useQuery<SubscriptionResponse>({
    ...getSubscriptionOptions({
      getToken,
    }),
    ...queryConfig,
  })

  const currentPlanName = useMemo(() => {
    if (isLoading) {
      return null
    }

    if (!data?.data) {
      return 'Free'
    }

    // TODO: Implement this
    return ''
  }, [data, isLoading])

  if (isLoading) {
    return null
  }

  return (
    <div
      className="relative mx-auto flex w-full max-w-2xl flex-col gap-4 overflow-hidden p-6 md:p-10"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <h1 className="text-2xl font-medium">Plans</h1>
      <div className="flex items-center justify-between">
        <p className="mb-2 text-base text-neutral-900">
          You&#39;re currently on the{' '}
          <span className="font-semibold">{currentPlanName}</span> plan. If you
          have any questions or would like further support with your plan,{' '}
          <Link className="cursor-pointer" href="#">
            <Button
              variant="link"
              className="h-auto gap-0.5 p-0 text-base font-medium"
            >
              <span>contact us</span>
              <ArrowUpRightIcon />
            </Button>
          </Link>
        </p>
      </div>
    </div>
  )
}
