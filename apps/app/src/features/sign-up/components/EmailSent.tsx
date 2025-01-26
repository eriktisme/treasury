import { useSignUp } from '@clerk/nextjs'

export const EmailSent = () => {
  const { signUp } = useSignUp()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center">Check your email</h1>
      <p className="text-center">
        We&apos;ve sent you a temporary link.
        <br />
        Please check your inbox at{' '}
        <span className="font-medium">{signUp?.emailAddress}</span>.
      </p>
    </div>
  )
}
