'use client'

import Link from 'next/link'
import { getProductOptions, getSubscriptionOptions } from '../api'
import { useQueries } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import { Button } from '@internal/design-system/components/ui/button'
import { ArrowLeftIcon, ArrowUpRightIcon } from 'lucide-react'
import { useAuth, useOrganization } from '@clerk/nextjs'
import { useMemo, useState } from 'react'
import {
  FreePricingCard,
  PricingCard,
} from '@/features/workspace-billing/components'
import { Switch } from '@internal/design-system/components/ui/switch'
import { Label } from '@internal/design-system/components/ui/label'

export const WorkspaceBillingPlansPageTemplate = () => {
  const { getToken } = useAuth()
  const { organization } = useOrganization()

  const [interval, setInterval] = useState<'month' | 'year'>('year')

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

  const currentPlanName = useMemo(() => {
    if (subscriptionQuery.isLoading || productsQuery.isLoading) {
      return null
    }

    const currentProduct = productsQuery.data?.data?.find(
      (product) =>
        product.productId === subscriptionQuery.data?.data?.seat.productId
    )

    if (!currentProduct) {
      return 'Free'
    }

    return currentProduct.name
  }, [productsQuery, subscriptionQuery])

  if (subscriptionQuery.isLoading || productsQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div
      className="flex flex-auto flex-col place-items-stretch"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <div>
        <Link href={`/${organization?.slug}/settings/billing`}>
          <Button variant="link">
            <ArrowLeftIcon />
            <span className="ml-1">Back to billing</span>
          </Button>
        </Link>
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 overflow-hidden p-4 md:p-10">
        <h1 className="text-2xl font-medium">Plans</h1>
        <div className="flex items-center justify-between">
          <p className="mb-2 text-base text-neutral-900">
            You&#39;re currently on the{' '}
            <span className="font-semibold">{currentPlanName}</span> plan. If
            you have any questions or would like further support with your plan,{' '}
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
        <div className="flex justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              checked={interval === 'year'}
              onCheckedChange={(checked) => {
                if (checked) {
                  setInterval('year')

                  return
                }

                setInterval('month')
              }}
              id="billing-period"
            />
            <Label htmlFor="billing-period">Billed annually</Label>
          </div>
        </div>
        <div className="flex w-full flex-shrink-0 flex-grow basis-auto flex-col items-center gap-6 lg:grid lg:auto-rows-min lg:grid-cols-4 lg:overflow-x-auto">
          <FreePricingCard subscription={subscriptionQuery.data?.data} />
          {productsQuery.data?.data.map((product) => (
            <PricingCard
              key={`pricing-card-${product.productId}`}
              product={product}
              subscription={subscriptionQuery.data?.data}
              interval={interval}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
