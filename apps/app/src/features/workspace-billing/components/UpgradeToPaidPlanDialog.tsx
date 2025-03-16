import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@internal/design-system/components/ui/dialog'
import { Button } from '@internal/design-system/components/ui/button'
import { useCurrentSubscription } from '@/context-store'
import { useCreateSubscription } from '@/features/workspace-billing'
import { useOrganization } from '@clerk/nextjs'

export const UpgradeToPaidPlanDialog = () => {
  const { organization } = useOrganization()

  const { currentSubscription, products } = useCurrentSubscription()

  const createSubscription = useCreateSubscription({
    mutationConfig: {
      onSuccess: async () => {
        // Do something with the data
      },
    },
  })

  if (currentSubscription) {
    return null
  }

  /**
   * Find the product with the name 'Business'
   * In a future iteration, we can change this to use a lookup key
   */
  const product = products.find((product) => product.name === 'Business')
  const price = product?.prices.find(
    (price) => price.lookupKey === 'business_yearly'
  )

  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to Treasury {product?.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            We&apos;ve upgraded you to a free 14-day trial of our{' '}
            {product?.name} plan. Explore the features and benefits Treasury has
            to offer and decide if it&apos;s the right fit for you.
          </p>
        </div>
        <DialogFooter>
          <Button
            loading={createSubscription.isPending}
            onClick={() => {
              createSubscription.mutate({
                lookupKey: price?.lookupKey ?? 'basic_monthly',
                quantity: organization?.membersCount ?? 1,
                trial: true,
              })
            }}
          >
            Start trial
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
