import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import type { Organization, User } from '@clerk/backend'

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
      <SidebarRail />
    </Sidebar>
  )
}
