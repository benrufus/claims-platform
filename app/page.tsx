import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-6xl font-bold mb-6 text-primary-orange">
          Claims Hub
        </h1>
        
        <p className="text-xl text-dark-muted mb-12">
          Multi-introducer claims management system
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/api/auth/login" className="btn btn-primary">
            Login to Dashboard
          </Link>
          
          <Link 
            href="/intro1" 
            className="btn btn-secondary"
          >
            View Example Landing Page
          </Link>
        </div>

        <div className="mt-12 text-sm text-dark-muted">
          <p>Built with Next.js 14, Supabase, Auth0, and TailwindCSS</p>
        </div>
      </div>
    </div>
  )
}
