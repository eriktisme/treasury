'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { InviteMemberDialog, MembersTable } from '../components'
import { useOrganization, useUser } from '@clerk/nextjs'
import type { RoleResource } from '@clerk/types'

export const WorkspaceMembersPageTemplate = () => {
  const { user } = useUser()

  const { isLoaded, memberships, organization } = useOrganization({
    memberships: {
      infinite: true,
    },
  })

  const [roles, setRoles] = useState<RoleResource[]>([])

  const fetchRoles = useCallback(async () => {
    if (!organization) {
      return
    }

    const response = await organization?.getRoles()

    setRoles(response.data)
  }, [organization])

  useEffect(() => {
    if (!isLoaded || roles.length > 0) {
      return
    }

    void fetchRoles()
  }, [fetchRoles, isLoaded, roles.length])

  if (!isLoaded || !user) {
    return null
  }

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
        <div className="w-full lg:max-w-80">{/* Search placeholder */}</div>
        <div>
          <InviteMemberDialog />
        </div>
      </div>
      <Suspense>
        <MembersTable
          currentUser={user}
          roles={roles}
          memberships={memberships?.data ?? []}
        />
      </Suspense>
    </div>
  )
}
