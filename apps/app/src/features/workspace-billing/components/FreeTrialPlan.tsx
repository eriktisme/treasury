'use client'

import { Button } from '@internal/design-system/components/ui/button'
import { useCreateCheckoutSession } from '../api'
import { useOrganization } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { env } from '@/env'
import { loadStripe } from '@stripe/stripe-js'
import type { ProductsResponse } from '@internal/api-schema/billing'

interface Props {
  price?: ProductsResponse['data'][0]['prices'][0]
}

export const FreeTrialPlan = (props: Props) => {
  const { organization } = useOrganization()

  const pathname = usePathname()

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
    <Button
      variant="secondary"
      loading={createCheckoutSession.isPending}
      onClick={() => {
        createCheckoutSession.mutate({
          callbackUrl: `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/${pathname}`,
          quantity: organization?.membersCount ?? 1,
          lookupKey: props.price?.lookupKey ?? 'basic_monthly',
        })
      }}
    >
      Start a free trial
    </Button>
  )
}
