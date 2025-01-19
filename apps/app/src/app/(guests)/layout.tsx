import type { PropsWithChildren } from 'react'

export default function Layout(props: Readonly<PropsWithChildren>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center pb-4 pt-10 font-sans md:pb-0 md:pt-0">
      {props.children}
    </div>
  )
}
