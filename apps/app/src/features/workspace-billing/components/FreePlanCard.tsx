import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@internal/design-system/components/ui/card'
import { Badge } from '@internal/design-system/components/ui/badge'
import { useOrganization } from '@clerk/nextjs'
import { UpgradePlan } from './UpgradePlan'

interface Props {
  showUpgrade?: boolean
}

export const FreePlanCard = (props: Props) => {
  const { organization } = useOrganization()

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <CardTitle className="mb-2 flex items-center space-x-1.5">
              <span>Free</span>
              <Badge variant="outline">Current plan</Badge>
            </CardTitle>
            <CardDescription>Free for all users</CardDescription>
          </div>
          <div>
            <p className="text-neutral-700">Users</p>
            <p className="text-right">{organization?.membersCount}</p>
          </div>
        </CardContent>
      </Card>
      {props.showUpgrade ? (
        <Card>
          <CardContent className="flex flex-row gap-2 p-4">
            <div>
              <CardTitle className="mb-2 flex items-center space-x-1.5">
                <span>Basic</span>
              </CardTitle>
              <CardDescription className="mb-4">
                &euro;10 per user/month
              </CardDescription>
              <UpgradePlan />
            </div>
            <div>{/* Placeholder perks */}</div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
