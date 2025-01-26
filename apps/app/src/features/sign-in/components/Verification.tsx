'use client'

import { useCallback, useEffect, useState } from 'react'
import { useClerk } from '@clerk/nextjs'

export const Verification = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading')

  const { handleEmailLinkVerification } = useClerk()

  const verify = useCallback(async () => {
    try {
      await handleEmailLinkVerification({
        //
      })

      setVerificationStatus('verified')
    } catch (err) {
      setVerificationStatus('failed')
    }
  }, [handleEmailLinkVerification])

  useEffect(() => {
    void verify()
  }, [verify])

  if (verificationStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (verificationStatus === 'failed') {
    return <div>Email link verification failed</div>
  }

  return (
    <div>Successfully signed in. Return to the original tab to continue.</div>
  )
}
