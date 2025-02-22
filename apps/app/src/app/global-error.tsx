'use client'

import { captureException } from '@sentry/nextjs'
import type NextError from 'next/error'
import { useEffect } from 'react'
import { env } from '@/env'
import { Button } from '@internal/design-system/components/ui/button'

type Props = {
  readonly error: NextError & { digest?: string }
  readonly reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    if (env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      captureException(error)
    }
  }, [error])

  return (
    <html>
      <body className="flex min-h-svh flex-col items-center justify-center">
        <h1>Oops, something went wrong</h1>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  )
}
