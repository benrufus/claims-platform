'use client'
import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignaturePage() {
  const params = useParams()
  const router = useRouter()
  const introducerSlug = params.introducer as string
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState<string>('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('=== SIGNATURE PAGE LOADING DATA ===')
      
      // ALWAYS try claim_form first (this has ALL the data)
      const formKey = `claim_form_${introducerSlug}`
      const dataKey = `claim_data_${introducerSlug}`
      
      const formData = sessionStorage.getItem(formKey)
      const claimData = sessionStorage.getItem(dataKey)
      
      console.log('claim_form_intro1 contents:', formData)
      console.log('claim_data_intro1 contents:', claimData)
      
      // Use claim_form if it exists and has data
      let dataToUse = formData
      let keyUsed = formKey
      
      // Only use claim_data if claim_form doesn't exist or is empty
      if (!dataToUse || dataToUse === '{}' || dataToUse === 'null') {
        console.warn('claim_form is empty, trying claim_data')
        dataToUse = claimData
        keyUsed = dataKey
      }
      
      console.log('✅ Using data from:', keyUsed)
      console.log('✅ Raw data:', dataToUse)
      
      if (dataToUse && dataToUse !== '{}' && dataToUse !== 'null') {
        const parsed = JSON.parse(dataToUse)
        console.log('✅ Parsed data:', parsed)
        console.log('✅ Fields present:', Object.keys(parsed))
        console.log('✅ Total fields:', Object.keys(parsed).length)
        setFormData(parsed)
      } else {
        console.error('❌ No valid claim data found in sessionStorage!')
      }
      setLoading(false)
    }
  }, [introducerSlug])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL())
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureData('')
  }

  const downloadPDF = async () => {
    if (!formData) return
    try {
      // Create text content
      const content = `CLAIM FORM SUBMISSION

Reference: CLM-${Date.now()}
Submitted: ${new Date().toLocaleString('en-GB')}

═══════════════════════════════════════════════════════════════

PERSONAL INFORMATION

Name: ${formData.title} ${formData.first_name} ${formData.middle_name || ''} ${formData.last_name}
Date of Birth: ${formData.dob_day}/${formData.dob_month}/${formData.dob_year}

CONTACT DETAILS

Email: ${formData.email}
Phone: ${formData.phone}

ADDRESS

${formData.address_line1}
${formData.address_line2 ? formData.address_line2 + '\n' : ''}${formData.city}
${formData.county ? formData.county + '\n' : ''}${formData.postcode}

FINANCE HISTORY

Car Finance: ${formData.has_car_finance}
Multiple Vehicles: ${formData.multiple_vehicles}

═══════════════════════════════════════════════════════════════

This claim has been digitally signed and submitted.

Signature: [Digital signature attached - see signature field in database]
`
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `claim-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file')
    }
  }

  const handleSubmit = async () => {
    if (!signatureData || !agreedToTerms) {
      alert('Please sign and agree to terms')
      return
    }
    setSubmitting(true)
    try {
      const claimData = {
        reference: `CLM-${Date.now()}`,
        introducer: introducerSlug,
        title: formData.title,
        first_name: formData.first_name,
        middle_name: formData.middle_name || '',
        last_name: formData.last_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        email: formData.email,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || '',
        city: formData.city,
        county: formData.county || '',
        postcode: formData.postcode,
        has_car_finance: formData.has_car_finance,
        multiple_vehicles: formData.multiple_vehicles,
        signature: signatureData,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }
      
      console.log('Submitting:', claimData)
      
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      })
      
      const result = await response.json()
      console.log('Response:', result)
      
      if (response.ok) {
        sessionStorage.removeItem(`claim_form_${introducerSlug}`)
        sessionStorage.removeItem(`claim_data_${introducerSlug}`)
        router.push(`/${introducerSlug}/processing`)
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      alert(`Submission failed: ${error.message}`)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '3rem', height: '3rem', borderWidth: '4px' }}></div>
          <p className="text-dark-muted">Loading your information...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-dark-muted mb-6">We couldn't find your form data. Please start over.</p>
          <Link href={`/${introducerSlug}/p1`} className="btn btn-primary">Start New Claim</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card">
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-primary-orange">Claims Hub</Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <h2 className="text-4xl font-bold mb-2 text-center text-green-500">Great News!</h2>
            <p className="text-xl text-center mb-6">You may be eligible for compensation</p>

            {/* What This Means */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">What This Means</h3>
              <div className="space-y-3 text-dark-muted">
                <p>• Based on your finance history, you may have been mis-sold</p>
                <p>• You could be entitled to compensation for unfair charges</p>
              </div>
            </div>

            <p className="text-center mb-8 text-dark-muted">All you need to do is review your information below, sign, check you're happy with everything by downloading the PDF and click submit claim.</p>

            {/* Summary */}
            <div className="bg-dark-bg p-6 rounded-lg mb-8">
              <h3 className="font-bold text-lg mb-4">Your Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-dark-muted">Name:</span> {formData.title || ''} {formData.first_name || ''} {formData.middle_name || ''} {formData.last_name || ''}</div>
                <div><span className="text-dark-muted">Date of Birth:</span> {formData.dob_day || ''}/{formData.dob_month || ''}/{formData.dob_year || ''}</div>
                <div><span className="text-dark-muted">Email:</span> {formData.email || 'Not provided'}</div>
                <div><span className="text-dark-muted">Phone:</span> {formData.phone || 'Not provided'}</div>
                <div className="col-span-2">
                  <span className="text-dark-muted">Address:</span> {formData.address_line1 || 'Not provided'}
                  {formData.address_line2 && `, ${formData.address_line2}`}
                  {formData.city && `, ${formData.city}`}
                  {formData.county && `, ${formData.county}`}
                  {formData.postcode && `, ${formData.postcode}`}
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mb-6">
              <label className="label label-required">Your Signature</label>
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="signature-canvas w-full"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <button type="button" onClick={clearSignature} className="btn btn-secondary mt-2">Clear Signature</button>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-dark-border bg-dark-bg"
                />
                <span className="text-sm">
                  I agree to the <a href="#" className="text-primary-orange hover:underline">Terms & Conditions</a> and authorize Claims Hub to process my claim
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={downloadPDF} disabled={!signatureData} className="btn btn-secondary flex-1">
                Download PDF
              </button>
              <button type="button" onClick={handleSubmit} disabled={!signatureData || !agreedToTerms || submitting} className="btn btn-primary flex-1">
                {submitting ? <span className="flex items-center gap-2 justify-center"><span className="spinner"></span>Submitting...</span> : 'Submit Claim'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
