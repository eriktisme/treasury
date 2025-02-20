'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { Protect, useOrganization } from '@clerk/nextjs'
import { BuildingIcon, ChevronLeftIcon, Settings2Icon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipShortcut,
} from '@internal/design-system/components/ui/tooltip'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props extends ComponentProps<typeof Sidebar> {
  //
}

export const SettingsSidebar = (props: Props) => {
  const pathname = usePathname()
  const { organization } = useOrganization()

  const accountPreferencesPath = `/${organization?.slug}/settings/account/preferences`
  const workspacePath = `/${organization?.slug}/settings/workspace`

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
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href={accountPreferencesPath}>
                  <SidebarMenuButton
                    isActive={accountPreferencesPath === pathname}
                  >
                    <Settings2Icon />
                    <span>Preferences</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <Protect role="org:admin">
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href={workspacePath}>
                    <SidebarMenuButton isActive={workspacePath === pathname}>
                      <BuildingIcon />
                      <span>Workspace</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </Protect>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
