import { env } from '@/env'
import type { MutationConfig } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import type {
  CheckoutResponse,
  CreateCheckoutBody,
} from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'

type Options = {
  mutationConfig?: MutationConfig<
    (body: CreateCheckoutBody) => Promise<CheckoutResponse>
  >
}

export const useCreateCheckoutSession = ({ mutationConfig }: Options) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  const { getToken } = useAuth()

  return useMutation({
    onSuccess: async (...args) => {
      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: async (body: CreateCheckoutBody) =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/billing/checkouts`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getToken()}`,
        },
        method: 'POST',
        body: JSON.stringify(body),
      }).then((res) => res.json()),
  })
}
