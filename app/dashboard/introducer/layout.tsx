'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="spinner w-12 h-12 border-4"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex bg-dark-bg">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-orange">Claims</h1>
          <p className="text-sm text-dark-muted mt-1">{user.name}</p>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard/introducer" className="sidebar-link">
            <ChartBarIcon className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/introducer/claims" className="sidebar-link">
            <UsersIcon className="w-5 h-5" />
            Claims
          </Link>
          <Link href="/dashboard/introducer/pages" className="sidebar-link">
            <DocumentDuplicateIcon className="w-5 h-5" />
            Landing Pages
          </Link>
          <Link href="/dashboard/introducer/settings" className="sidebar-link">
            <Cog6ToothIcon className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="mt-auto pt-8">
          <a href="/api/auth/logout" className="sidebar-link text-red-400 hover:text-red-300">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
