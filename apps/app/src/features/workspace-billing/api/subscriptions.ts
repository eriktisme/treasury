import { env } from '@/env'
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  CreateSubscriptionBody,
  SubscriptionsResponse,
} from '@internal/api-schema/billing'
import type { GetToken } from '@clerk/types'
import type { MutationConfig } from '@/lib/react-query'
import { useAuth } from '@clerk/nextjs'

interface GetSubscriptionOptions {
  getToken?: GetToken
}

export const getSubscriptionOptions = (options: GetSubscriptionOptions) =>
  queryOptions<SubscriptionsResponse>({
    queryKey: ['subscription'],
    queryFn: async () =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/billing/subscriptions`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await options.getToken?.()}`,
        },
        method: 'GET',
      }).then((res) => res.json()),
  })

type CreateSubscriptionOptions = {
  mutationConfig?: MutationConfig<
    (body: CreateSubscriptionBody) => Promise<SubscriptionsResponse>
  >
}

export const useCreateSubscription = ({
  mutationConfig,
}: CreateSubscriptionOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {}

  const queryClient = useQueryClient()

  const { getToken } = useAuth()

  return useMutation({
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({
        queryKey: ['subscription'],
      })

      onSuccess?.(...args)
    },
    ...restConfig,
    mutationFn: async (body: CreateSubscriptionBody) =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/billing/subscriptions`, {
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
