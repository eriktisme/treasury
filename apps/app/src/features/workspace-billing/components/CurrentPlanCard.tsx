import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { FreePlanCard } from './FreePlanCard'

interface Props {
  subscription?: SubscriptionResponse['data']
}

export const CurrentPlanCard = (props: Props) => {
  if (!props.subscription) {
    return <FreePlanCard />
  }

  return <>{/* Placeholder */}</>
}
