import { Button } from '@internal/design-system/components/ui/button'
import { UpgradePlan } from './UpgradePlan'
import { FreeTrialPlan } from './FreeTrialPlan'
import { useMemo } from 'react'
import { DowngradePlan } from './DowngradePlan'
import type { PricingCardProps } from './PricingCard'
import { formatDistanceToNow } from 'date-fns'

export const PricingCardButton = (props: PricingCardProps) => {
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

  const isCurrentProduct =
    props.currentSubscription?.seat.productId === props.product.productId

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

  if (
    isCurrentProduct &&
    props.currentSubscription?.status === 'trialing' &&
    props.currentSubscription.trial
  ) {
    return (
      <>
        <Button variant="secondary" disabled>
          Trial in progress
        </Button>
        <div className="py-2 text-center text-sm text-neutral-900">
          {formatDistanceToNow(props.currentSubscription.trial.end, {
            addSuffix: false,
          })}{' '}
          remaining
        </div>
      </>
    )
  }

  if (isCurrentProduct) {
    return (
      <Button variant="secondary" disabled>
        Current plan
      </Button>
    )
  }

  if (props.isDowngrade && price) {
    return <DowngradePlan lookupKey={price.lookupKey!} />
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <UpgradePlan price={price} />
      {!hasTrialedProductBefore &&
      !isCurrentProduct &&
      !props.currentSubscription ? (
        <FreeTrialPlan product={props.product} price={price} />
      ) : null}
    </div>
  )
}
