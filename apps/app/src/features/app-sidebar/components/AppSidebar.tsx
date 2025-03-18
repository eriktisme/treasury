import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import type { Organization, User } from '@clerk/backend'
import { SubscriptionIsTrialing } from './SubscriptionIsTrialing'

interface Props extends ComponentProps<typeof Sidebar> {
  user: User | null
  workspaces: Organization[]
}

export const AppSidebar = ({ user, workspaces, ...props }: Props) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher user={user} workspaces={workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>{/* Placeholder */}</SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>
          <SubscriptionIsTrialing />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
