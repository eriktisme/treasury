import { env } from '@/env'
import { queryOptions } from '@tanstack/react-query'
import type { ProductsResponse } from '@internal/api-schema/billing'
import type { GetToken } from '@clerk/types'

interface Options {
  getToken?: GetToken
}

export const getProductOptions = (options: Options) =>
  queryOptions<ProductsResponse>({
    queryKey: ['products'],
    queryFn: async () =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/billing/products`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await options.getToken?.()}`,
        },
        method: 'GET',
      }).then((res) => res.json()),
  })
