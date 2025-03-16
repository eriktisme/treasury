import { CardContent } from '@internal/design-system/components/ui/card'
import { CheckIcon } from 'lucide-react'

interface Props {
  features: string[]
}

export const PricingCardContent = (props: Props) => {
  if (props.features.length === 0) {
    return null
  }

  return (
    <CardContent>
      {props.features.map((feature) => (
        <div key={feature} className="flex gap-2">
          <CheckIcon className="mt-0.5 size-5 flex-shrink-0" />
          <span>{feature}</span>
        </div>
      ))}
    </CardContent>
  )
}
