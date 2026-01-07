'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [stats, setStats] = useState({ total: 0, successful: 0, unsuccessful: 0, duplicates: 0 })
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false }).limit(10)
      if (error) throw error
      setClaims(data || [])
      const total = data?.length || 0
      const successful = data?.filter(c => c.status === 'submitted').length || 0
      const unsuccessful = data?.filter(c => c.status === 'rejected').length || 0
      const duplicates = data?.filter(c => c.status === 'duplicate').length || 0
      setStats({ total, successful, unsuccessful, duplicates })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const conversionRate = stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0
  const userName = user?.name || user?.email?.split('@')[0] || 'Ben'

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="border-b border-dark-border bg-dark-card/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-orange">Claims</Link>
          <p className="text-sm text-dark-muted">{user?.email || 'ben@rufusdesign.co.uk'}</p>
        </div>
      </header>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-dark-muted">Welcome back, {userName}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-dark-muted text-sm mb-1">Total Claims</p><p className="text-3xl font-bold">{stats.total}</p></div>
              <svg className="w-12 h-12 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-dark-muted text-sm mb-1">Successful</p><p className="text-3xl font-bold text-green-500">{stats.successful}</p><p className="text-xs text-green-500 mt-1">{conversionRate}% conversion</p></div>
              <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-dark-muted text-sm mb-1">Unsuccessful</p><p className="text-3xl font-bold text-red-500">{stats.unsuccessful}</p></div>
              <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            </div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-dark-muted text-sm mb-1">Duplicates</p><p className="text-3xl font-bold text-yellow-500">{stats.duplicates}</p></div>
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Landing Pages</h2>
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <div><h3 className="font-semibold mb-1">Main Landing Page</h3><p className="text-sm text-dark-muted">http://localhost:3000/intro1</p></div>
            <div className="flex gap-2">
              <button onClick={() => router.push('/intro1')} className="px-4 py-2 bg-dark-border rounded-lg hover:bg-dark-border/80">View</button>
              <button className="btn btn-primary">Edit</button>
            </div>
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Claims</h2>
            <button className="text-primary-orange hover:underline text-sm">View all →</button>
          </div>
          {loading ? <div className="text-center py-12"><div className="spinner mx-auto"></div></div> : claims.length === 0 ? 
            <div className="text-center py-12 text-dark-muted">No claims yet. Share your landing page to start receiving claims.</div> : 
            <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">NAME</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">EMAIL</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">PHONE</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">REFERENCE</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">STATUS</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-dark-muted">DATE</th>
            </tr></thead><tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b border-dark-border hover:bg-dark-bg/50">
                  <td className="py-3 px-4">{claim.first_name} {claim.last_name}</td>
                  <td className="py-3 px-4 text-dark-muted text-sm">{claim.email}</td>
                  <td className="py-3 px-4 text-dark-muted text-sm">{claim.phone}</td>
                  <td className="py-3 px-4 text-dark-muted text-sm">{claim.reference}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs ${claim.status === 'submitted' ? 'bg-green-500/20 text-green-500' : claim.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{claim.status}</span></td>
                  <td className="py-3 px-4 text-dark-muted text-sm">{new Date(claim.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody></table></div>
          }
        </div>
      </div>
    </div>
  )
}
