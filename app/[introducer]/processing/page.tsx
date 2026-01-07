'use client'
import Link from 'next/link'

export default function ProcessingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <div className="card">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-4 text-green-500">Great News!</h1>
          <p className="text-xl text-center mb-8">You may be eligible for compensation</p>

          {/* What This Means */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">What This Means</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-dark-muted">Based on your finance history, you may have been mis-sold</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-dark-muted">You could be entitled to compensation for unfair charges</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-dark-muted">Our team will contact you within 48 hours to discuss next steps</p>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-dark-bg rounded-lg p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center flex-shrink-0 text-xl font-bold">1</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Check Your Email</h3>
                <p className="text-dark-muted text-sm">We've sent you a confirmation email with your reference number and details</p>
              </div>
            </div>
            <div className="bg-dark-bg rounded-lg p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center flex-shrink-0 text-xl font-bold">2</div>
              <div>
                <h3 className="font-bold text-lg mb-1">We'll Contact You</h3>
                <p className="text-dark-muted text-sm">One of our specialists will call you within 48 hours to discuss your claim</p>
              </div>
            </div>
            <div className="bg-dark-bg rounded-lg p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center flex-shrink-0 text-xl font-bold">3</div>
              <div>
                <h3 className="font-bold text-lg mb-1">No Win, No Fee</h3>
                <p className="text-dark-muted text-sm">Remember, you only pay if your claim is successful. There are no upfront costs.</p>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-blue-400 font-bold mb-3">Important Information</h3>
            <ul className="text-dark-muted text-sm space-y-2 list-disc list-inside">
              <li>Average processing time: 4-8 weeks</li>
              <li>Keep your phone nearby - we'll call from a UK number</li>
              <li>Check your spam folder for our email</li>
              <li>Have your finance documents ready if available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
