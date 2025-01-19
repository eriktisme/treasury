import './globals.css'
import { createMetadata } from '@internal/seo'
import type { PropsWithChildren } from 'react'

export const metadata = createMetadata({
  // Add metadata here
})

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
