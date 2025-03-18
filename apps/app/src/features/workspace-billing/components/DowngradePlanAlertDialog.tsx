import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@internal/design-system/components/ui/alert-dialog'
import { Button } from '@internal/design-system/components/ui/button'
import { useCreateSubscriptionSchedule } from '../api'

interface Props {
  lookupKey: string
}

export const DowngradePlanAlertDialog = (props: Props) => {
  const createSubscriptionSchedule = useCreateSubscriptionSchedule({
    mutationConfig: {
      onSuccess: () => {
        // Do something after the downgrade schedule has been scheduled
      },
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Downgrade to Free</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change summary</AlertDialogTitle>
        </AlertDialogHeader>
        <div>{/* Placeholder */}</div>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep current plan</AlertDialogCancel>
          <Button
            loading={createSubscriptionSchedule.isPending}
            onClick={() => {
              createSubscriptionSchedule.mutate({
                lookupKey: props.lookupKey,
                direction: 'downgrade',
              })
            }}
            variant="destructive"
          >
            Confirm downgrade
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
