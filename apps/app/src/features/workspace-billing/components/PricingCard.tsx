import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@internal/design-system/components/ui/card'
import type {
  ProductsResponse,
  SubscriptionsResponse,
} from '@internal/api-schema/billing'
import { PricingCardContent } from './PricingCardContent'
import { useMemo } from 'react'
import { PricingCardButton } from './PricingCardButton'

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

interface Props {
  interval: 'month' | 'year'
  product: ProductsResponse['data'][0]
  subscriptions?: SubscriptionsResponse['data']
}

export const PricingCard = (props: Props) => {
  const price = props.product.prices.find(
    (price) => price.recurring.interval === props.interval
  )

  const currency = useMemo(() => {
    if (price?.unit.currency === 'eur') {
      return '€'
    }

    return '$'
  }, [price?.unit.currency])

  const amount = useMemo(() => {
    if (!price?.unit.amount) {
      return 0
    }

    if (props.interval === 'year') {
      return price.unit.amount / 12
    }

    return price.unit.amount
  }, [price?.unit.amount, props.interval])

  const hasPrice = props.product.prices.length > 0

  return (
    <Card className="flex flex-col items-stretch">
      <CardHeader className="flex-grow">
        <CardDescription className="text-lg font-semibold">
          {props.product.name}
        </CardDescription>
        <div className="flex h-10 items-center gap-2.5">
          {hasPrice ? (
            <>
              <CardTitle className="text-2xl">
                {currency} {formatter.format(amount / 100)}
              </CardTitle>
              <div className="text-xs text-neutral-900">
                <div>per user/month</div>
                {props.interval === 'year' ? (
                  <div className="text-neutral-700">billed annually</div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="text-xs text-neutral-900">
              Custom pricing and trial are available
            </div>
          )}
        </div>
        <PricingCardButton {...props} />
      </CardHeader>
      <PricingCardContent features={[]} />
    </Card>
  )
}
