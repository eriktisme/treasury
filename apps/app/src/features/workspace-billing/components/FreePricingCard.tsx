import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@internal/design-system/components/ui/card'
import type { SubscriptionsResponse } from '@internal/api-schema/billing'
import { Button } from '@internal/design-system/components/ui/button'
import { PricingCardContent } from './PricingCardContent'
import { useMemo } from 'react'

interface Props {
  subscriptions?: SubscriptionsResponse['data']
}

export const FreePricingCard = (props: Props) => {
  const hasActiveSubscription = useMemo(() => {
    if (!props.subscriptions) {
      return false
    }

    return props.subscriptions.some(
      (subscription) => subscription.status === 'active'
    )
  }, [props.subscriptions])

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-grow">
        <CardDescription className="text-lg font-semibold">
          Free
        </CardDescription>
        <div className="flex h-10 items-center gap-2.5">
          <CardTitle className="text-2xl">&euro; 0</CardTitle>
          <div className="text-sm text-neutral-900">
            <div>per user/month</div>
          </div>
        </div>
        {hasActiveSubscription ? (
          <Button variant="secondary">Downgrade to Free</Button>
        ) : (
          <Button variant="secondary" disabled>
            Current plan
          </Button>
        )}
      </CardHeader>
      <PricingCardContent features={[]} />
    </Card>
  )
}
