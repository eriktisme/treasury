import type { PropsWithChildren } from 'react'
import { Protect } from '@clerk/nextjs'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const client = await clerkClient()

interface Props extends PropsWithChildren {
  params: Promise<{
    slug: string
  }>
}

export default async function Layout({ children, ...props }: Readonly<Props>) {
  const params = await props.params

  const { has, redirectToSignIn, userId } = await auth()

  if (!userId) {
    redirectToSignIn()

    return
  }

  const user = await client.users.getUser(userId)

  if (!user) {
    redirectToSignIn()

    return
  }

  const { isSuperAdmin = false } = user.publicMetadata as {
    isSuperAdmin?: boolean
  }

  if (isSuperAdmin) {
    return <>{children}</>
  }

  if (
    !has({
      role: 'org:admin',
    })
  ) {
    redirect(`/${params.slug}/settings/account`)
  }

  return <Protect role="org:admin">{children}</Protect>
}
