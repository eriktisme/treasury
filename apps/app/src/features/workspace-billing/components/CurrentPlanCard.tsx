import { Card, CardContent } from '@internal/design-system/components/ui/card'
import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { FreePlanCard } from './FreePlanCard'

interface Props {
  subscription?: SubscriptionResponse['data']
}

export const CurrentPlanCard = (props: Props) => {
  if (!props.subscription) {
    return <FreePlanCard />
  }

  return (
    <Card>
      <CardContent className="p-2"></CardContent>
    </Card>
  )
}
