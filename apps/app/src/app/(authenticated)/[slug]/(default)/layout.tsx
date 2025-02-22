import type { ReactNode } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from '@internal/design-system/components/ui/sidebar'
import { AppSidebar } from '@/features/app-sidebar'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import type { Organization } from '@clerk/backend'
import { HotKeys } from '@/features/hot-keys'
import { SyncActiveOrganizationFromURLToSession } from '@/lib/sync-active-workspace-from-url-to-session'

const client = await clerkClient()

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const response = await client.users.getOrganizationMembershipList({
    userId: user?.id,
  })

  const workspaces: Organization[] = response.data.map((membership) =>
    JSON.parse(JSON.stringify(membership.organization))
  )

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          workspaces={workspaces}
          user={user ? JSON.parse(JSON.stringify(user)) : null}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <HotKeys />
      <SyncActiveOrganizationFromURLToSession />
    </>
  )
}
