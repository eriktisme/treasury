'use client'

import { useCurrentSubscription } from '@/context-store'
import { Badge } from '@internal/design-system/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@internal/design-system/components/ui/tooltip'
import { CircleAlert } from 'lucide-react'
import { useMemo } from 'react'
import type { SubscriptionsResponse } from '@internal/api-schema/billing'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns'
import { useOrganization } from '@clerk/nextjs'
import Link from 'next/link'

const now = new Date()

export const SubscriptionIsTrialing = () => {
  const { currentSubscription, products } = useCurrentSubscription()

  const { organization } = useOrganization()

  const currentProduct = useMemo(() => {
    if (!currentSubscription) {
      return null
    }

    return (
      products.find(
        (product) => product.productId === currentSubscription.seat.productId
      ) ?? null
    )
  }, [currentSubscription, products])

  if (!currentSubscription || !currentProduct) {
    return null
  }

  const isTrialing = currentSubscription.status === 'trialing'

  if (!isTrialing) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/${organization?.slug}/settings/billing`}>
          <Badge variant="default">
            <CircleAlert className="mr-2 size-4" />
            <span>
              {currentProduct.name} trial ends in{' '}
              <RemainingTimeShort currentSubscription={currentSubscription} />
            </span>
          </Badge>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        There are{' '}
        <RemainingTimeLong currentSubscription={currentSubscription} />{' '}
        remaining in your workspace&apos;s {currentProduct.name} trial.
      </TooltipContent>
    </Tooltip>
  )
}

interface RemainingTimeProps {
  currentSubscription: SubscriptionsResponse['data'][0]
}

function RemainingTimeShort({
  currentSubscription,
}: Readonly<RemainingTimeProps>) {
  const remainingTime = useMemo(() => {
    if (!currentSubscription.trial) {
      return null
    }

    const days = differenceInDays(currentSubscription.trial.end, now)
    const hours = differenceInHours(currentSubscription.trial.end, now)
    const minutes = differenceInMinutes(currentSubscription.trial.end, now)

    if (days > 0) {
      return `${days}d`
    }

    if (hours > 0) {
      return `${hours}h`
    }

    return `${minutes}m`
  }, [currentSubscription])

  if (!remainingTime) {
    return null
  }

  return <>{remainingTime}</>
}

function RemainingTimeLong({
  currentSubscription,
}: Readonly<RemainingTimeProps>) {
  const remainingTime = useMemo(() => {
    if (!currentSubscription.trial) {
      return null
    }

    const days = differenceInDays(currentSubscription.trial.end, now)
    const hours = differenceInHours(currentSubscription.trial.end, now)
    const minutes = differenceInMinutes(currentSubscription.trial.end, now)

    if (days > 0) {
      return `${days} days`
    }

    if (hours > 0) {
      return `${hours} hours`
    }

    return `${minutes} minutes`
  }, [currentSubscription])

  if (!remainingTime) {
    return null
  }

  return <>{remainingTime}</>
}
