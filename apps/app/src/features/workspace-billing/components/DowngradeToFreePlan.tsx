'use client'

import { Button } from '@internal/design-system/components/ui/button'
import { useCreateSubscriptionSchedule } from '../api'
import { useRouter } from 'next/navigation'
import { useOrganization } from '@clerk/nextjs'

export const DowngradeToFreePlan = () => {
  const { organization } = useOrganization()

  const router = useRouter()

  const createSubscriptionSchedule = useCreateSubscriptionSchedule({
    mutationConfig: {
      onSuccess: () => {
        router.push(`/${organization?.slug}/settings/billing`)
      },
    },
  })

  return (
    <Button
      loading={createSubscriptionSchedule.isPending}
      onClick={() => {
        createSubscriptionSchedule.mutate({
          lookupKey: 'free_yearly',
          direction: 'downgrade',
        })
      }}
      variant="secondary"
    >
      Downgrade to Free
    </Button>
  )
}
