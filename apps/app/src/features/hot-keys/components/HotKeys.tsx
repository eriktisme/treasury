'use client'

import { useHotkeys } from 'react-hotkeys-hook'

import { useClerk } from '@clerk/nextjs'
import { env } from '@/env'

export const HotKeys = () => {
  const { signOut } = useClerk()

  useHotkeys('ctrl+q', (evt) => {
    evt.preventDefault()

    void signOut({
      redirectUrl: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    })
  })

  return null
}
