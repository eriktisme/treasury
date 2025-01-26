import { useSignIn } from '@clerk/nextjs'

export const EmailSent = () => {
  const { signIn } = useSignIn()

  return (
    <div className="text-center">
      <p>
        We&apos;ve sent you a temporary link.
        <br />
        Please check your inbox at{' '}
        <span className="font-medium">{signIn?.identifier}</span>.
      </p>
    </div>
  )
}
