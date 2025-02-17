import type { ReactNode } from 'react'
import {
  SidebarInset,
  SidebarProvider,
} from '@internal/design-system/components/ui/sidebar'
import { AppSidebar } from '@/features/app-sidebar'

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
