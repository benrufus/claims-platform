'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function CheckingPage() {
  const params = useParams()
  const router = useRouter()
  const introducerSlug = params.introducer as string

  useEffect(() => {
    // Simulate checking - auto redirect to signature page after 3 seconds
    const timer = setTimeout(() => {
      router.push(`/${introducerSlug}/signature`)
    }, 3000)

    return () => clearTimeout(timer)
  }, [introducerSlug, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card flex items-center justify-center">
      <div className="text-center max-w-lg px-6">
        <div className="mb-8">
          {/* Animated spinner */}
          <div className="inline-block">
            <div className="w-24 h-24 border-8 border-dark-card border-t-primary-orange rounded-full animate-spin"></div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Checking Your Eligibility</h1>
        <p className="text-xl text-dark-muted mb-8">
          Please wait while we check if you qualify for compensation...
        </p>

        {/* Progress indicators */}
        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-center gap-3 p-4 bg-dark-card rounded-lg animate-pulse">
            <div className="w-2 h-2 bg-primary-orange rounded-full"></div>
            <span className="text-dark-muted">Verifying your details...</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-dark-card rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
            <div className="w-2 h-2 bg-primary-orange rounded-full"></div>
            <span className="text-dark-muted">Checking finance records...</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-dark-card rounded-lg animate-pulse" style={{ animationDelay: '1s' }}>
            <div className="w-2 h-2 bg-primary-orange rounded-full"></div>
            <span className="text-dark-muted">Calculating potential compensation...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
