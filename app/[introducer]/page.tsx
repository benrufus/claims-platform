'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function IntroducerLandingPage() {
  const params = useParams()
  const introducerSlug = params.introducer as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-primary-orange">Claims Portal</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Have You Been Mis-Sold?
        </h1>
        <p className="text-xl md:text-2xl text-dark-muted mb-12 max-w-3xl mx-auto">
          Find out if you're entitled to compensation. Our free claim check takes just 2 minutes.
        </p>
        
        <Link 
          href={`/${introducerSlug}/p1`}
          className="btn btn-primary text-lg px-12 py-4 inline-block"
        >
          Start Your Free Claim Check →
        </Link>

        <p className="mt-6 text-sm text-dark-muted">
          ✓ No upfront fees  ✓ No win, no fee  ✓ Quick and easy
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Fast Process</h3>
            <p className="text-dark-muted">
              Complete our simple form in just 2 minutes and get an instant decision
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-dark-muted">
              Your information is protected with bank-level security and encryption
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">No Win, No Fee</h3>
            <p className="text-dark-muted">
              You only pay if your claim is successful. No hidden charges
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Fill Out Our Form</h3>
              <p className="text-dark-muted">
                Answer a few simple questions about your situation. It takes less than 2 minutes.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">We Check Your Eligibility</h3>
              <p className="text-dark-muted">
                Our system instantly checks if you may be entitled to compensation.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Get Your Results</h3>
              <p className="text-dark-muted">
                Find out immediately if you have a valid claim and what to do next.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href={`/${introducerSlug}/p1`}
            className="btn btn-primary text-lg px-12 py-4 inline-block"
          >
            Check Your Eligibility Now →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Common Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Is this really free?</h3>
            <p className="text-dark-muted">
              Yes, absolutely. There are no upfront costs. We only get paid if your claim is successful.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">How long does it take?</h3>
            <p className="text-dark-muted">
              The initial check takes just 2 minutes. If you have a valid claim, the full process typically takes 4-8 weeks.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">What information do I need?</h3>
            <p className="text-dark-muted">
              Just basic contact details and information about your situation. We'll guide you through it step by step.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-primary-orange to-primary-orange-hover py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Out If You Have a Claim?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of people who have already checked their eligibility
          </p>
          <Link 
            href={`/${introducerSlug}/p1`}
            className="btn bg-white text-primary-orange hover:bg-gray-100 text-lg px-12 py-4 inline-block"
          >
            Start Your Free Check →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-dark-muted">
          <p>© 2025 Claims Platform. All rights reserved.</p>
          <p className="mt-2">Introducer: {introducerSlug}</p>
        </div>
      </footer>
    </div>
  )
}
