'use client'

import { Suspense } from 'react'
import { Verification } from '../components'

export const VerificationPageTemplate = () => {
  return (
    <Suspense>
      <Verification />
    </Suspense>
  )
}
