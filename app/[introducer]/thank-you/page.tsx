'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function ThankYouPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const introducerSlug = params.introducer as string
  const referenceNumber = searchParams.get('ref')
  const status = searchParams.get('status') || 'successful'

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Link href={`/${introducerSlug}`} className="text-2xl font-bold text-primary-orange">
            Claims Portal
          </Link>
        </div>
      </header>

      {/* Success Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold mb-4 text-green-500">
              Thank You!
            </h1>
            
            <p className="text-xl text-dark-text mb-8">
              Your claim has been successfully submitted
            </p>

            {/* Reference Number */}
            {referenceNumber && (
              <div className="mb-8 p-6 bg-dark-bg rounded-lg">
                <p className="text-sm text-dark-muted mb-2">Your Reference Number</p>
                <p className="text-3xl font-mono font-bold text-primary-orange">
                  {referenceNumber}
                </p>
                <p className="text-xs text-dark-muted mt-2">
                  Please save this for your records
                </p>
              </div>
            )}

            {/* What Happens Next */}
            <div className="text-left mb-8">
              <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Confirmation Email</h3>
                    <p className="text-sm text-dark-muted">
                      You'll receive an email confirmation within the next few minutes with your reference number and next steps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Assessment</h3>
                    <p className="text-sm text-dark-muted">
                      Our team will review your claim and assess your eligibility. This typically takes 1-2 business days.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-orange text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">We'll Contact You</h3>
                    <p className="text-sm text-dark-muted">
                      If your claim is eligible, we'll contact you to discuss the next steps. No action needed from you right now.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-left mb-8">
              <h3 className="font-bold mb-2 text-blue-400">Important Information</h3>
              <ul className="text-sm text-dark-muted space-y-1">
                <li>• Check your email (including spam folder) for confirmation</li>
                <li>• Keep your reference number safe</li>
                <li>• We may contact you for additional information</li>
                <li>• Average processing time: 4-8 weeks</li>
              </ul>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={`/${introducerSlug}`}
                className="btn btn-secondary"
              >
                Back to Home
              </Link>
            </div>

            {/* Support */}
            <div className="mt-8 pt-8 border-t border-dark-border">
              <p className="text-sm text-dark-muted">
                Questions? Contact our support team
              </p>
              <p className="text-sm text-primary-orange mt-1">
                support@claimsportal.com
              </p>
            </div>
          </div>

          {/* Test Mode Notice */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-center">
            <p className="text-yellow-400 text-sm">
              <strong>Test Mode:</strong> This is a demo submission. No actual claim was filed.
              Configure Supabase and your credit check API to process real claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
