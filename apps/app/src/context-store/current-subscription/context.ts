'use client'

import { createContext, useContext } from 'react'
import type {
  ProductsResponse,
  SubscriptionsResponse,
} from '@internal/api-schema/billing'

type CurrentSubscriptionState = {
  currentSubscription: SubscriptionsResponse['data'][0] | null
  products: ProductsResponse['data']
}

export const CurrentSubscriptionContext =
  createContext<CurrentSubscriptionState>({
    currentSubscription: null,
    products: [],
  })

export const useCurrentSubscription = (): CurrentSubscriptionState => {
  const context = useContext(CurrentSubscriptionContext)

  if (!context) {
    throw new Error('Missing CurrentSubscriptionContext parent component.')
  }

  return context
}
