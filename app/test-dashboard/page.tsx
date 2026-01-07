'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'

// Mock data for testing
const mockStats = {
  total_claims: 127,
  successful: 89,
  unsuccessful: 23,
  duplicates: 15,
  pending: 0,
  conversion_rate: 70.08
}

const mockClaims = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john@example.com',
    phone: '07123456789',
    status: 'successful',
    created_at: new Date().toISOString(),
    reference_number: 'CLM-12345'
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah@example.com',
    phone: '07987654321',
    status: 'pending',
    created_at: new Date().toISOString(),
    reference_number: null
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Williams',
    email: 'mike@example.com',
    phone: '07555123456',
    status: 'unsuccessful',
    created_at: new Date().toISOString(),
    reference_number: 'CLM-12346'
  },
]

export default function TestDashboard() {
  const [stats] = useState(mockStats)
  const [recentClaims] = useState(mockClaims)
  const introducerInfo = {
    name: 'Test Introducer',
    slug: 'intro1'
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-orange">Claims</h1>
          <p className="text-sm text-dark-muted mt-1">{introducerInfo.name}</p>
          <div className="mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
            TEST MODE - No Auth Required
          </div>
        </div>

        <nav className="space-y-2">
          <Link href="/test-dashboard" className="sidebar-link sidebar-link-active">
            <ChartBarIcon className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/test-dashboard" className="sidebar-link">
            <UsersIcon className="w-5 h-5" />
            Claims
          </Link>
          <Link href="/test-dashboard" className="sidebar-link">
            <DocumentDuplicateIcon className="w-5 h-5" />
            Landing Pages
          </Link>
        </nav>

        <div className="mt-8 p-4 bg-dark-bg rounded-lg text-sm">
          <p className="text-dark-muted mb-2">To enable full features:</p>
          <ol className="text-xs text-dark-muted space-y-1 list-decimal list-inside">
            <li>Set up Supabase</li>
            <li>Configure Auth0</li>
            <li>Update .env.local</li>
          </ol>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-dark-muted">Welcome back, {introducerInfo.name}</p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
          <p className="text-blue-400">
            <strong>Test Mode:</strong> This is a preview with mock data. Configure Auth0 and Supabase to use real data.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Claims</p>
                <p className="stat-value">{stats.total_claims}</p>
              </div>
              <UsersIcon className="w-12 h-12 text-primary-orange opacity-50" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Successful</p>
                <p className="stat-value text-green-500">{stats.successful}</p>
                <p className="stat-change stat-change-positive">
                  {stats.conversion_rate}% conversion
                </p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Unsuccessful</p>
                <p className="stat-value text-red-500">{stats.unsuccessful}</p>
              </div>
              <XCircleIcon className="w-12 h-12 text-red-500 opacity-50" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Duplicates</p>
                <p className="stat-value text-yellow-500">{stats.duplicates}</p>
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
                  http://localhost:3000/{introducerInfo.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/${introducerInfo.slug}`}
                  target="_blank"
                  className="btn btn-secondary text-sm"
                >
                  View
                </Link>
                <button className="btn btn-primary text-sm" disabled>
                  Edit (Requires Setup)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Claims (Mock Data)</h3>
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
                {recentClaims.map((claim) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="card mt-8 bg-dark-card border-2 border-primary-orange">
          <h3 className="text-xl font-bold mb-4 text-primary-orange">Next Steps to Go Live:</h3>
          <ol className="space-y-3 text-dark-muted list-decimal list-inside">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">1.</span>
              <span><strong>Set up Supabase:</strong> Create account at supabase.com, run schema.sql</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">2.</span>
              <span><strong>Configure Auth0:</strong> Create account at auth0.com, set up application</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">3.</span>
              <span><strong>Update .env.local:</strong> Add your API keys from Supabase and Auth0</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0">4.</span>
              <span><strong>Get Data-8 API key:</strong> For UK address validation (optional but recommended)</span>
            </li>
          </ol>
          
          <div className="mt-6 p-4 bg-dark-bg rounded-lg">
            <p className="text-sm text-dark-muted">
              📖 Full setup instructions are in <code className="text-primary-orange">README.md</code>
            </p>
          </div>
        </div>
      </main>
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
