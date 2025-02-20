import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { Protect } from '@clerk/nextjs'
import { ChevronLeftIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipShortcut,
} from '@internal/design-system/components/ui/tooltip'

interface Props extends ComponentProps<typeof Sidebar> {
  //
}

export const SettingsSidebar = (props: Props) => {
  return (
    <Sidebar {...props} className="w-60">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton>
                  <ChevronLeftIcon />
                  <span>Back to app</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent align="start">
                <div className="space-x-3">
                  <span>Back to app</span>
                  <span className="space-x-1">
                    <TooltipShortcut>⌘</TooltipShortcut>
                    <TooltipShortcut>Esc</TooltipShortcut>
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>{/* Placeholder */}</SidebarGroup>
        <Protect role="org:admin">
          <SidebarGroup>{/* Placeholder */}</SidebarGroup>
        </Protect>
      </SidebarContent>
    </Sidebar>
  )
}
