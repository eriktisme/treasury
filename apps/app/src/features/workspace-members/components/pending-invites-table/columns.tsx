'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { formatDistance } from 'date-fns/formatDistance'
import type { OrganizationInvitationResource } from '@clerk/types'

export const getColumns = (): Array<
  ColumnDef<OrganizationInvitationResource>
> => [
  {
    accessorKey: 'identifier',
    header: () => <div>Pending invites</div>,
    cell: ({ row }) => {
      return <span>{row.original.emailAddress}</span>
    },
  },
  {
    accessorKey: 'role',
    header: () => <div>Role</div>,
    cell: ({ row }) => {
      return (
        <span className="capitalize">
          {row.original.role.replace('org:', '')}
        </span>
      )
    },
  },
  {
    accessorKey: 'sent',
    header: () => <div>Sent</div>,
    cell: ({ row }) => {
      return (
        <span>
          {formatDistance(row.original.createdAt, new Date(), {
            addSuffix: true,
          })}
        </span>
      )
    },
  },
]
