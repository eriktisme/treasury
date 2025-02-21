'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@clerk/backend'
import { formatDistance } from 'date-fns/formatDistance'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@internal/design-system/components/ui/avatar'

export const getColumns = (): Array<ColumnDef<User>> => [
  {
    accessorKey: 'fullName',
    header: () => <div>Name</div>,
    cell: ({ row }) => {
      const member = row.original

      const displayName =
        member.fullName || member.emailAddresses?.at(0)?.emailAddress

      return (
        <div className="flex w-full items-center gap-4">
          <Avatar className="rounded-full">
            {member.imageUrl ? (
              <AvatarImage src={member.imageUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{displayName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{displayName}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'lastActiveAt',
    header: () => <div>Last active</div>,
    cell: ({ row }) => {
      const member = row.original

      if (!member.lastActiveAt) {
        return 'Never'
      }

      return (
        <span>
          {formatDistance(new Date(member.lastActiveAt), new Date(), {
            addSuffix: false,
          })}
        </span>
      )
    },
  },
]
