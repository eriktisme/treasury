import type { ReactNode } from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <div className="min-h-svh bg-neutral-50">{children}</div>
}
