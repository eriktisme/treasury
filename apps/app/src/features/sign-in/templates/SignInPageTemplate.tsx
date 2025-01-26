import { SignInForm } from '../components'
import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'

export const SignInPageTemplate = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="#"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme Inc.
      </Link>
      <SignInForm />
    </div>
  )
}
