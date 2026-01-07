'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function QualifiedPage() {
  const params = useParams()
  const introducerSlug = params.introducer as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Link href={`/${introducerSlug}`} className="text-2xl font-bold text-primary-orange">
            Claims Hub
          </Link>
        </div>
      </header>

      {/* Success Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-5xl font-bold mb-4 text-green-500">
              Great News!
            </h1>
            
            <p className="text-2xl text-dark-text mb-8">
              You may be eligible for compensation
            </p>

            {/* Key Points */}
            <div className="mb-8 p-6 bg-green-500/10 rounded-lg border border-green-500/30">
              <h2 className="text-xl font-bold mb-4">What This Means</h2>
              <ul className="text-left space-y-3 text-dark-muted">
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span>Based on your finance history, you may have been mis-sold</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span>You could be entitled to compensation for unfair charges</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span>Our team will contact you within 48 hours to discuss next steps</span>
                </li>
              </ul>
            </div>

            {/* What Happens Next */}
            <div className="text-left mb-8">
              <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start p-4 bg-dark-bg rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Check Your Email</h3>
                    <p className="text-sm text-dark-muted">
                      We've sent you a confirmation email with your reference number and details
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-dark-bg rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">We'll Contact You</h3>
                    <p className="text-sm text-dark-muted">
                      One of our specialists will call you within 48 hours to discuss your claim
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-dark-bg rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-orange text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">No Win, No Fee</h3>
                    <p className="text-sm text-dark-muted">
                      Remember, you only pay if your claim is successful. There are no upfront costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="p-4 bg-blue-500/20 border border-blue-500 rounded-lg text-left mb-8">
              <h3 className="font-bold mb-2 text-blue-400">Important Information</h3>
              <ul className="text-sm text-dark-muted space-y-1">
                <li>• Average processing time: 4-8 weeks</li>
                <li>• Keep your phone nearby - we'll call from a UK number</li>
                <li>• Check your spam folder for our email</li>
                <li>• Have your finance documents ready if available</li>
              </ul>
            </div>

            {/* CTA */}
            <Link 
              href={`/${introducerSlug}`}
              className="btn btn-primary inline-block"
            >
              Back to Home
            </Link>

            {/* Support */}
            <div className="mt-8 pt-8 border-t border-dark-border">
              <p className="text-sm text-dark-muted">
                Questions? Contact us at{' '}
                <span className="text-primary-orange">support@claimshub.co.uk</span>
              </p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg text-center">
            <p className="text-yellow-400 text-sm">
              <strong>Demo Mode:</strong> This is a demonstration. In production, actual eligibility checks will be performed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
