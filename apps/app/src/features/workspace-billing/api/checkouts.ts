import { env } from '@/env'
import type { MutationConfig } from '@/lib/react-query'
import { useMutation } from '@tanstack/react-query'
import type {
  CheckoutResponse,
  CreateCheckoutBody,
} from '@internal/api-schema/billing'
import { useAuth } from '@clerk/nextjs'
import type { GetToken } from '@clerk/types'

interface GetSubscriptionOptions {
  getToken: GetToken
}

const createCheckoutSession = async (
  body: CreateCheckoutBody,
  options: GetSubscriptionOptions
): Promise<CheckoutResponse> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/billing/checkouts`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await options.getToken()}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  })

  return response.json()
}

type Options = {
  mutationConfig?: MutationConfig<typeof createCheckoutSession>
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
      createCheckoutSession(body, { getToken }),
  })
}
