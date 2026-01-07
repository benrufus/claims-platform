'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  UsersIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

interface Stats {
  total_claims: number
  successful: number
  unsuccessful: number
  duplicates: number
  pending: number
  conversion_rate: number
}

interface Claim {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  created_at: string
  reference_number: string | null
}

export default function IntroducerDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentClaims, setRecentClaims] = useState<Claim[]>([])
  const [introducerInfo, setIntroducerInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, isLoading, router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/introducers/stats')
      const data = await response.json()

      if (response.ok) {
        setStats(data.stats)
        setRecentClaims(data.recentClaims)
        setIntroducerInfo(data.introducer)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-dark-muted">Welcome back, {introducerInfo?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Total Claims</p>
              <p className="stat-value">{stats?.total_claims || 0}</p>
            </div>
            <UsersIcon className="w-12 h-12 text-primary-orange opacity-50" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Successful</p>
              <p className="stat-value text-green-500">{stats?.successful || 0}</p>
              <p className="stat-change stat-change-positive">
                {stats?.conversion_rate || 0}% conversion
              </p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Unsuccessful</p>
              <p className="stat-value text-red-500">{stats?.unsuccessful || 0}</p>
            </div>
            <XCircleIcon className="w-12 h-12 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Duplicates</p>
              <p className="stat-value text-yellow-500">{stats?.duplicates || 0}</p>
            </div>
            <DocumentDuplicateIcon className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Landing Page Links */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold mb-4">Your Landing Pages</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <div>
              <p className="font-medium">Main Landing Page</p>
              <p className="text-sm text-dark-muted">
                {process.env.NEXT_PUBLIC_APP_URL}/{introducerInfo?.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Link 
                href={`/${introducerInfo?.slug}`}
                target="_blank"
                className="btn btn-secondary text-sm"
              >
                View
              </Link>
              <Link 
                href={`/builder/${introducerInfo?.slug}`}
                className="btn btn-primary text-sm"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Recent Claims</h3>
          <Link href="/dashboard/introducer/claims" className="text-primary-orange hover:text-primary-orange-hover">
            View all →
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-dark-muted">
                    No claims yet. Share your landing page to start receiving claims.
                  </td>
                </tr>
              ) : (
                recentClaims.map((claim) => (
                  <tr key={claim.id}>
                    <td className="font-medium">
                      {claim.first_name} {claim.last_name}
                    </td>
                    <td className="text-dark-muted">{claim.email}</td>
                    <td className="text-dark-muted">{claim.phone}</td>
                    <td className="font-mono text-sm">
                      {claim.reference_number || 'Pending'}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="text-dark-muted">
                      {new Date(claim.created_at).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'successful':
      return 'badge-success'
    case 'unsuccessful':
      return 'badge-error'
    case 'dupe':
      return 'badge-warning'
    case 'pending':
      return 'badge-info'
    default:
      return 'badge-info'
  }
}
