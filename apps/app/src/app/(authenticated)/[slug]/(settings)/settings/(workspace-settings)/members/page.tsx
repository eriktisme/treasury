import { WorkspaceMembersPageTemplate } from '@/features/workspace-members'
import type { Metadata } from 'next'
import { clerkClient, auth } from '@clerk/nextjs/server'

export const metadata: Metadata = {
  title: 'Members',
}

interface Props {
  searchParams?: Promise<{
    page?: string
    query?: string
  }>
}

const client = await clerkClient()

export default async function Page(props: Props) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''

  const { orgId } = await auth()

  const response = await client.users.getUserList({
    organizationId: [orgId],
    query: query.length >= 3 ? query : '',
  })

  return (
    <WorkspaceMembersPageTemplate
      members={response.data.map((user) => JSON.parse(JSON.stringify(user)))}
    />
  )
}
