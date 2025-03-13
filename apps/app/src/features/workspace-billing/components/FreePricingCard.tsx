import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@internal/design-system/components/ui/card'
import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { Button } from '@internal/design-system/components/ui/button'
import { PricingCardContent } from './PricingCardContent'

interface Props {
  subscription?: SubscriptionResponse['data']
}

export const FreePricingCard = (props: Props) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription className="text-lg font-semibold">
          Free
        </CardDescription>
        <div className="flex h-12 items-center gap-2.5">
          <CardTitle className="text-2xl">&euro; 0</CardTitle>
          <div className="text-sm text-neutral-900">
            <div>per user/month</div>
          </div>
        </div>
        {props.subscription ? (
          <Button variant="secondary">Downgrade to Free</Button>
        ) : (
          <Button disabled>Current plan</Button>
        )}
      </CardHeader>
      <PricingCardContent features={[]} />
    </Card>
  )
}
