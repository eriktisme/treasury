import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { useCurrentSubscription } from '@/context-store'
import { UpgradePlan } from './UpgradePlan'
import { DowngradeToFreePlan } from './DowngradeToFreePlan'

export const TrialExpiredDialog = () => {
  const { currentSubscription, products } = useCurrentSubscription()

  if (!currentSubscription) {
    return null
  }

  if (
    currentSubscription &&
    currentSubscription.status === 'trialing' &&
    currentSubscription.trial &&
    new Date(currentSubscription.trial.end) >= new Date()
  ) {
    return null
  }

  const product = products.find(
    (product) => product.productId === currentSubscription.seat.productId
  )
  const price = product?.prices.find(
    (price) => price.priceId === currentSubscription.seat.priceId
  )

  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Your {product?.name} trial expired</DialogTitle>
        </DialogHeader>
        <div>
          <p>Upgrade now to continue using the features you love.</p>
        </div>
        <DialogFooter>
          <DowngradeToFreePlan />
          <UpgradePlan price={price} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
