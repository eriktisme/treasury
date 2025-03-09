'use client'

import { Button } from '@internal/design-system/components/ui/button'
import { useCreateCheckoutSession } from '../api'
import { useOrganization } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { env } from '@/env'
import type { CheckoutResponse } from '@internal/api-schema/billing'
import { loadStripe } from '@stripe/stripe-js'

export const UpgradePlan = () => {
  const { organization } = useOrganization()

  const pathname = usePathname()

  const createCheckoutSession = useCreateCheckoutSession<CheckoutResponse>({
    mutationConfig: {
      onSuccess: async (response) => {
        const { data } = response as unknown as CheckoutResponse

        const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

        await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        })
      },
    },
  })

  return (
    <Button
      loading={createCheckoutSession.isPending}
      onClick={() => {
        createCheckoutSession.mutate({
          callbackUrl: `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/${pathname}`,
          quantity: organization?.membersCount ?? 1,
          lookupKey: 'basic_monthly',
        })
      }}
    >
      Upgrade plan
    </Button>
  )
}
