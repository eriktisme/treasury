'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { formatDistance } from 'date-fns/formatDistance'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@internal/design-system/components/ui/avatar'
import { SelectRole } from '../SelectRole'
import type {
  OrganizationCustomRoleKey,
  OrganizationMembershipResource,
  RoleResource,
  UserResource,
} from '@clerk/types'

interface GetColumnsParams {
  currentUser: UserResource
  roles: RoleResource[]
}

export const getColumns = (
  params: GetColumnsParams
): Array<ColumnDef<OrganizationMembershipResource>> => [
  {
    accessorKey: 'fullName',
    header: () => <div>Name</div>,
    cell: ({ row }) => {
      const member = row.original.publicUserData

      return (
        <div className="flex w-full items-center gap-4">
          <Avatar className="size-8 rounded-full">
            {member.imageUrl ? (
              <AvatarImage src={member.imageUrl} alt={member.identifier} />
            ) : null}
            <AvatarFallback>{member.identifier}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{member.identifier}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      const member = row.original

      return (
        <SelectRole
          disabled={member.publicUserData.userId === params.currentUser.id}
          onChange={async (role) => {
            await member.update({
              role: role as OrganizationCustomRoleKey,
            })
            await member?.reload()
          }}
          value={member.role as OrganizationCustomRoleKey}
          options={params.roles.map(
            (role) => role.key as OrganizationCustomRoleKey
          )}
        />
      )
    },
  },
  {
    accessorKey: 'joined',
    header: () => <div>Joined</div>,
    cell: ({ row }) => {
      const member = row.original

      return (
        <span>
          {formatDistance(member.createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      )
    },
  },
]
