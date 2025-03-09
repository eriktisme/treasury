'use client'

import Link from 'next/link'
import { CurrentPlanCard } from '../components'
import { getSubscriptionOptions } from '../api'
import { useQuery } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import { Button } from '@internal/design-system/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'

export const WorkspaceBillingPageTemplate = () => {
  const { getToken } = useAuth()

  const { data, isLoading } = useQuery<SubscriptionResponse>({
    ...getSubscriptionOptions({
      getToken,
    }),
    ...queryConfig,
  })

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
      <h1 className="text-2xl font-medium">Billing</h1>
      <div className="flex items-center justify-between">
        <p className="mb-2 truncate text-base text-neutral-900">
          For questions about billing,{' '}
          <Link href="#" className="cursor-pointer font-medium">
            contact us
          </Link>
          .
        </p>
        <Link className="cursor-pointer" href="#">
          <Button variant="ghost">
            <span>All plans</span>
            <ArrowRightIcon />
          </Button>
        </Link>
      </div>
      <CurrentPlanCard subscription={data?.data} />
    </div>
  )
}
