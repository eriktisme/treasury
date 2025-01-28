'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@internal/design-system/components/ui/button'

export const LogOutButton = () => {
  const { signOut } = useClerk()

  return (
    <Button
      onClick={() => signOut({ redirectUrl: '/auth/sign-in' })}
      variant="ghost"
    >
      Log out
    </Button>
  )
}
