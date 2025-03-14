'use client'

import { Button } from '@internal/design-system/components/ui/button'
import { useCreateCheckoutSession } from '../api'
import { useOrganization } from '@clerk/nextjs'
import { env } from '@/env'
import { loadStripe } from '@stripe/stripe-js'
import type { ProductsResponse } from '@internal/api-schema/billing'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@internal/design-system/components/ui/alert-dialog'

interface Props {
  price?: ProductsResponse['data'][0]['prices'][0]
  product?: ProductsResponse['data'][0]
}

export const FreeTrialPlan = (props: Props) => {
  const { organization } = useOrganization()

  const createCheckoutSession = useCreateCheckoutSession({
    mutationConfig: {
      onSuccess: async ({ data }) => {
        const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

        await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        })
      },
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Start a free trial</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Trial {props.product?.name}</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <p>
            Your workspace will have full access to all {props.product?.name}{' '}
            features for the next 14 days.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="default"
              loading={createCheckoutSession.isPending}
              onClick={() => {
                createCheckoutSession.mutate({
                  callbackUrl: `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/settings/billing`,
                  lookupKey: props.price?.lookupKey ?? 'basic_monthly',
                  quantity: organization?.membersCount ?? 1,
                  trial: true,
                })
              }}
            >
              Start trial
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
