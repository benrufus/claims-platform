import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import GTMScript from '@/components/GTMScript'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Claims Platform',
  description: 'Multi-introducer claims management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <GTMScript />
      </head>
      <UserProvider>
        <body className={`${inter.className} bg-dark-bg text-dark-text min-h-screen`}>
          {children}
        </body>
      </UserProvider>
    </html>
  )
}
