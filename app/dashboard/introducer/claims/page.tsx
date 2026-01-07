'use client'

import { useState, useEffect } from 'react'

export default function ClaimsPage() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch claims from API when connected
    setLoading(false)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">All Claims</h1>
      
      <div className="card">
        <div className="text-center py-12 text-dark-muted">
          <p className="text-lg mb-4">Claims management coming soon!</p>
          <p className="text-sm">This page will show all your claims with filtering and search.</p>
        </div>
      </div>
    </div>
  )
}
