import type { PropsWithChildren } from 'react'
import { Protect } from '@clerk/nextjs'

export default async function Layout({
  children,
}: Readonly<PropsWithChildren>) {
  return <Protect role="org:admin">{children}</Protect>
}
