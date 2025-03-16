import type {
  ProductsResponse,
  SubscriptionsResponse,
} from '@internal/api-schema/billing'
import { FreePlanCard } from './FreePlanCard'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@internal/design-system/components/ui/card'
import { ManageSubscription } from './ManageSubscription'
import { Badge } from '@internal/design-system/components/ui/badge'
import { useMemo } from 'react'

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

interface Props {
  products?: ProductsResponse['data']
  subscriptions?: SubscriptionsResponse['data']
}

export const CurrentPlanCard = (props: Props) => {
  const currentSubscription = useMemo(() => {
    if (!props.subscriptions) {
      return null
    }

    return props.subscriptions.find((subscription) => {
      return (
        new Date() >= new Date(subscription.currentPeriod.start) &&
        new Date() <= new Date(subscription.currentPeriod.end)
      )
    })
  }, [props.subscriptions])

  const currentProduct = useMemo(() => {
    if (!currentSubscription) {
      return null
    }

    return props.products?.find(
      (product) => product.productId === currentSubscription.seat.productId
    )
  }, [currentSubscription, props.products])

  const currentPrice = useMemo(() => {
    if (!currentSubscription) {
      return null
    }

    if (!currentProduct) {
      return null
    }

    return currentProduct.prices.find(
      (price) => price.priceId === currentSubscription.seat.priceId
    )
  }, [currentProduct, currentSubscription])

  const currency = useMemo(() => {
    if (currentPrice?.unit.currency === 'eur') {
      return '€'
    }

    return '$'
  }, [currentPrice])

  const amount = useMemo(() => {
    if (!currentPrice?.unit.amount) {
      return 0
    }

    if (currentPrice.recurring.interval === 'year') {
      return currentPrice.unit.amount / 12
    }

    return currentPrice.unit.amount
  }, [currentPrice])

  if (!currentSubscription) {
    return <FreePlanCard showUpgrade />
  }

  return (
    <>
      {currentSubscription?.status === 'trialing' ? <FreePlanCard /> : null}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <CardTitle className="mb-2 flex items-center space-x-1.5">
              <span>{currentProduct?.name}</span>
              {currentSubscription.status === 'active' ? (
                <Badge variant="outline">Current plan</Badge>
              ) : null}
              {currentSubscription.status === 'trialing' ? (
                <Badge variant="outline">Trial plan</Badge>
              ) : null}
            </CardTitle>
            <CardDescription className="mb-4">
              {currency} {formatter.format(amount / 100)} per user/month
            </CardDescription>
            <ManageSubscription />
          </div>
          <div className="flex-1">{/* Placeholder perks */}</div>
        </CardContent>
        {currentSubscription.status === 'trialing' &&
        currentSubscription.trial ? (
          <CardFooter className="p-4 pt-0 text-xs">
            You&apos;re on a trial of this plan. You&apos;ll need to upgrade to
            continue using it beyond{' '}
            {formatDate(new Date(currentSubscription.trial.end))}
          </CardFooter>
        ) : null}
      </Card>
    </>
  )
}
