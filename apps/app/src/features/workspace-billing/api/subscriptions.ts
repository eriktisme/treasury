import { env } from '@/env'
import { queryOptions } from '@tanstack/react-query'
import type { SubscriptionResponse } from '@internal/api-schema/billing'
import type { GetToken } from '@clerk/types'

interface Options {
  getToken?: GetToken
}

export const getSubscriptionOptions = (options: Options) =>
  queryOptions<SubscriptionResponse>({
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
