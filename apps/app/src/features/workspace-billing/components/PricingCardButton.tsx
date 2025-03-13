import type {
  ProductsResponse,
  SubscriptionsResponse,
} from '@internal/api-schema/billing'
import { Button } from '@internal/design-system/components/ui/button'
import { UpgradePlan } from './UpgradePlan'
import { FreeTrialPlan } from './FreeTrialPlan'
import { useMemo } from 'react'

/**
 * Canceled is a special status,
 * when a subscription is canceled we have to check the canceledAt date
 */
const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'canceled']

interface Props {
  interval: 'month' | 'year'
  product: ProductsResponse['data'][0]
  subscriptions?: SubscriptionsResponse['data']
}

export const PricingCardButton = (props: Props) => {
  const price = props.product.prices.find(
    (price) => price.recurring.interval === props.interval
  )

  const hasTrialedProductBefore = useMemo(() => {
    if (!props.subscriptions || props.subscriptions?.length === 0) {
      return false
    }

    return props.subscriptions.some(
      (subscription) => subscription.seat.productId === props.product.productId
    )
  }, [props.product.productId, props.subscriptions])

  const isCurrentProduct = props.subscriptions?.find(
    (subscription) =>
      ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status) &&
      (subscription.canceledAt === null ||
        subscription.canceledAt <= new Date()) &&
      subscription.seat.productId === props.product.productId
  )

  const hasPrice = props.product.prices.length > 0

  if (!hasPrice) {
    return (
      <Button
        onClick={() => {
          //
        }}
        variant="secondary"
      >
        Talk to sales
      </Button>
    )
  }

  if (isCurrentProduct) {
    return (
      <Button variant="secondary" disabled>
        Current plan
      </Button>
    )
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <UpgradePlan price={price} />
      {!hasTrialedProductBefore && !isCurrentProduct ? (
        <FreeTrialPlan price={price} />
      ) : null}
    </div>
  )
}
