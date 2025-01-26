'use client'

import { SignUpForm } from '../components'
import Link from 'next/link'
import { GalleryVerticalEnd } from 'lucide-react'
import { Suspense } from 'react'

export const SignUpPageTemplate = () => {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Link
        href="#"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </Link>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  )
}
