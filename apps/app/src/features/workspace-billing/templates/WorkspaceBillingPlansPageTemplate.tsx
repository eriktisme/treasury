'use client'

import Link from 'next/link'
import { getProductOptions, getSubscriptionOptions } from '../api'
import { useQueries } from '@tanstack/react-query'
import { queryConfig } from '@/lib/react-query'
import { Button } from '@internal/design-system/components/ui/button'
import { ArrowLeftIcon, ArrowUpRightIcon } from 'lucide-react'
import { useAuth, useOrganization } from '@clerk/nextjs'
import { useMemo, useState } from 'react'
import { FreePricingCard, PricingCard } from '../components'
import { Switch } from '@internal/design-system/components/ui/switch'
import { Label } from '@internal/design-system/components/ui/label'

/**
 * Canceled is a special status,
 * when a subscription is canceled we have to check the canceledAt date
 */
const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'canceled']

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

  const currentProduct = useMemo(() => {
    if (subscriptionQuery.isLoading || productsQuery.isLoading) {
      return null
    }

    return productsQuery.data?.data?.find((product) =>
      subscriptionQuery.data?.data?.some(
        (subscription) => subscription.seat.productId === product.productId
      )
    )
  }, [productsQuery, subscriptionQuery])

  const currentSubscription = useMemo(() => {
    if (subscriptionQuery.isLoading) {
      return null
    }

    return (
      subscriptionQuery.data?.data?.find((subscription) => {
        return (
          new Date(subscription.currentPeriod.start) <= new Date() &&
          new Date(subscription.currentPeriod.end) >= new Date() &&
          ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status)
        )
      }) ?? null
    )
  }, [subscriptionQuery])

  const currentProductIndex = useMemo(() => {
    if (subscriptionQuery.isLoading || productsQuery.isLoading) {
      return null
    }

    return productsQuery.data?.data.findIndex(
      (product) => product.productId === currentProduct?.productId
    )
  }, [currentProduct, productsQuery, subscriptionQuery])

  const currentPlanName = useMemo(() => {
    if (!currentProduct) {
      return null
    }

    return currentProduct.name
  }, [currentProduct])

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
        <div className="grid grid-cols-1 gap-6 overflow-x-auto md:grid-cols-4">
          {productsQuery.data?.data.map((product, index) => {
            if (product.name === 'Free') {
              return (
                <FreePricingCard
                  key={`pricing-card-${product.productId}`}
                  subscriptions={subscriptionQuery.data?.data}
                  interval={interval}
                />
              )
            }

            let isDowngrade = false

            if (
              currentProductIndex &&
              currentSubscription?.status !== 'trialing' &&
              index < currentProductIndex
            ) {
              isDowngrade = true
            }

            return (
              <PricingCard
                key={`pricing-card-${product.productId}`}
                product={product}
                subscriptions={subscriptionQuery.data?.data}
                interval={interval}
                isDowngrade={isDowngrade}
                currentSubscription={currentSubscription}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
