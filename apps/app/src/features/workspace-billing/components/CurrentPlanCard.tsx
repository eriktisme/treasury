import type { SubscriptionResponse } from '@internal/api-schema/billing'
import { FreePlanCard } from './FreePlanCard'
import {
  Card,
  CardContent,
  CardFooter,
} from '@internal/design-system/components/ui/card'
import { ManagerPlanButton } from './ManagerPlanButton'

interface Props {
  subscription?: SubscriptionResponse['data']
}

export const CurrentPlanCard = (props: Props) => {
  if (!props.subscription) {
    return <FreePlanCard />
  }

  return (
    <Card>
      <CardContent className="p-4"></CardContent>
      <CardFooter>
        <ManagerPlanButton />
      </CardFooter>
    </Card>
  )
}
