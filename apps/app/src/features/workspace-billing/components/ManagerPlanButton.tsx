import { Button } from '@internal/design-system/components/ui/button'
import { useCreatePortalSession } from '../api'
import { env } from '@/env'
import { usePathname } from 'next/navigation'

export const ManagerPlanButton = () => {
  const pathname = usePathname()

  const createPortalSession = useCreatePortalSession({
    mutationConfig: {
      onSuccess: ({ data }) => {
        window.location.href = data.url
      },
    },
  })

  return (
    <Button
      loading={createPortalSession.isPending}
      onClick={() => {
        createPortalSession.mutate({
          returnUrl: `https://${env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/${pathname}`,
        })
      }}
      variant="default"
    >
      Manage plan
    </Button>
  )
}
