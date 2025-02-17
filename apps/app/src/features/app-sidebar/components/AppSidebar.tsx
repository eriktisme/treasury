import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@internal/design-system/components/ui/sidebar'
import type { ComponentProps } from 'react'
import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'

export const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="#" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>{/* Placeholder */}</SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
