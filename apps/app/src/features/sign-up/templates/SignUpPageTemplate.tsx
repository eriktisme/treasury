import dynamic from 'next/dynamic'

const SignUpForm = dynamic(() =>
  import('@clerk/nextjs').then((mod) => mod.SignUp)
)

export const SignUpPageTemplate = () => {
  return (
    <div className="flex flex-col gap-12">
      <SignUpForm />
    </div>
  )
}
