import type { ReactNode } from 'react'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { Providers } from './providers'

const client = await clerkClient()

export default async function Layout(
  props: Readonly<{
    children: ReactNode
    params: Promise<{
      slug: string
    }>
  }>
) {
  const params = await props.params

  const { redirectToSignIn, userId } = await auth()

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

  try {
    const organization = await client.organizations.getOrganization({
      slug: params.slug,
    })

    const memberships = await client.users.getOrganizationMembershipList({
      limit: 500,
      userId,
    })

    if (
      !memberships.data.some(
        (membership) => membership.organization.id === organization.id
      )
    ) {
      throw new Error('Not a member of this organization')
    }
  } catch (e) {
    const err = e as Error

    if (err.message === 'Not a member of this organization') {
      if (isSuperAdmin) {
        return <Providers>{props.children}</Providers>
      }

      return notFound()
    }

    if (err.message === 'Not Found') {
      return notFound()
    }

    throw err
  }

  return <Providers>{props.children}</Providers>
}
