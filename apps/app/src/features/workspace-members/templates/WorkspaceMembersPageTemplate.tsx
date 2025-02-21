import { Suspense } from 'react'
import type { User } from '@clerk/backend'
import { InviteMemberDialog, Search, MembersTable } from '../components'

interface Props {
  members: User[]
}

export const WorkspaceMembersPageTemplate = (props: Props) => {
  return (
    <div
      className="relative mx-auto flex w-full max-w-4xl flex-col overflow-hidden p-6 md:p-10"
      style={{
        overscrollBehavior: 'contain',
        scrollbarGutter: 'stable',
      }}
    >
      <h1 className="mb-6 text-2xl font-medium">Members</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="w-full lg:max-w-80">
          <Search />
        </div>
        <div>
          <InviteMemberDialog />
        </div>
      </div>
      <Suspense>
        <MembersTable members={props.members} />
      </Suspense>
    </div>
  )
}
