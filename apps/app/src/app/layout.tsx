import './globals.css'
import type { PropsWithChildren } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { createMetadata } from '@internal/seo'

export const metadata = createMetadata({
  // Add metadata here
})

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
