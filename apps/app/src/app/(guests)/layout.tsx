'use client'

import type { PropsWithChildren } from 'react'
import { Suspense } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { env } from '@/env'
import { generateSignInToken } from '@/features/sign-in'

const IsLoggedIn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect_url')
  const { isLoaded, isSignedIn, sessionId } = useAuth()

  const redirectToRedirectUrl = useCallback(
    async (sessionId: string) => {
      const token = await generateSignInToken(sessionId)

      router.push(
        `${redirectUrl}?token=${token}` ||
          env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
      )
    },
    [redirectUrl, router]
  )

  /**
   * Whenever a user is signed in, redirect to the given redirect url (mobile app)
   * or when there is no redirect url, redirect to the default after sign in url.
   */
  useEffect(() => {
    if (isSignedIn && sessionId) {
      void redirectToRedirectUrl(sessionId)
    }
  }, [isSignedIn, redirectToRedirectUrl, redirectUrl, router, sessionId])

  if (!isLoaded) {
    return <div>Loading ...</div>
  }

  return <></>
}

export default function Layout(props: Readonly<PropsWithChildren>) {
  return (
    <Suspense>
      <IsLoggedIn />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        {props.children}
      </div>
    </Suspense>
  )
}
