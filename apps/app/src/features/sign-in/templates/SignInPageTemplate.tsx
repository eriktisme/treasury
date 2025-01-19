import dynamic from 'next/dynamic'

const SignInForm = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignIn)
)

export const SignInPageTemplate = () => {
  return (
    <div className="flex flex-col gap-12">
      <SignInForm />
    </div>
  )
}
