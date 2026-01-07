'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const FORM_STEPS = {
  p1: { title: "Have you had a car on finance?", type: 'radio', field: 'has_car_finance', options: ['Yes', 'No'], autoAdvance: true },
  p2: { title: "Have you financed more than one vehicle since 2007?", type: 'radio', field: 'multiple_vehicles', options: ['Yes', 'No'], autoAdvance: true },
  p3: { title: "What's your date of birth?", type: 'date', autoAdvance: false },
  p4: { title: "Your current address", type: 'address', autoAdvance: false },
  p5: { title: "What's your name?", type: 'name', autoAdvance: false },
  p6: { title: "Where should we send your potential compensation details?", type: 'contact', autoAdvance: false }
}

export default function ClaimFormPage() {
  const params = useParams()
  const router = useRouter()
  const introducerSlug = params.introducer as string
  const stepSlug = params.step as string
  const currentStepData = FORM_STEPS[stepSlug as keyof typeof FORM_STEPS]
  const steps = Object.keys(FORM_STEPS)
  const currentStepIndex = steps.indexOf(stepSlug)
  const totalSteps = steps.length
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`claim_form_${introducerSlug}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setFormData(parsed)
        console.log('Loaded existing form data:', parsed)
      } else {
        console.log('No existing form data, starting fresh')
      }
      // Always set dataLoaded to true so saves can happen
      setDataLoaded(true)
    }
  }, [introducerSlug])

  useEffect(() => {
    if (dataLoaded && typeof window !== 'undefined') {
      const dataToSave = JSON.stringify(formData)
      sessionStorage.setItem(`claim_form_${introducerSlug}`, dataToSave)
      console.log(`[Step ${stepSlug}] Saved form data:`, formData)
      console.log(`[Step ${stepSlug}] Field count:`, Object.keys(formData).length)
    }
  }, [formData, introducerSlug, dataLoaded, stepSlug])

  useEffect(() => {
    if (stepSlug === 'p4' && typeof window !== 'undefined') {
      let initAttempts = 0
      const maxAttempts = 20
      
      const checkAndInit = () => {
        initAttempts++
        
        // Check if libraries are loaded
        if (!(window as any).jQuery || !(window as any).data8) {
          if (initAttempts < maxAttempts) {
            setTimeout(checkAndInit, 200)
          }
          return
        }
        
        // Check if postcode input exists
        const postcodeInput = document.getElementById('postcode')
        if (!postcodeInput) {
          if (initAttempts < maxAttempts) {
            setTimeout(checkAndInit, 200)
          }
          return
        }
        
        try {
          // Initialize Data-8
          new (window as any).data8.postcodeLookupButton([
            { element: 'postcode', field: 'postcode' },
            { element: 'line1', field: 'line1' },
            { element: 'line2', field: 'line2' },
            { element: 'city', field: 'town' },
            { element: 'county', field: 'county' }
          ], {
            ajaxKey: 'KP47-XBK7-N7ZW-VQDG',
            license: 'WebClickFull'
          }).show()
          
          // Remove duplicate Find buttons
          setTimeout(() => {
            const buttons = document.querySelectorAll('.postcodeLookup')
            if (buttons.length > 1) {
              for (let i = 1; i < buttons.length; i++) {
                buttons[i].remove()
              }
            }
            console.log('✅ Data-8 initialized successfully')
          }, 200)
          
          // Watch for address changes
          const watchInterval = setInterval(() => {
            const line1 = (document.getElementById('line1') as HTMLInputElement)?.value
            if (line1 && line1 !== formData.address_line1) {
              setFormData(prev => ({
                ...prev,
                address_line1: line1,
                address_line2: (document.getElementById('line2') as HTMLInputElement)?.value || '',
                city: (document.getElementById('city') as HTMLInputElement)?.value || '',
                county: (document.getElementById('county') as HTMLInputElement)?.value || '',
                postcode: (document.getElementById('postcode') as HTMLInputElement)?.value || ''
              }))
            }
          }, 500)
        } catch (error) {
          console.error('❌ Data-8 initialization error:', error)
        }
      }
      
      // Start with a small delay to let React render
      setTimeout(checkAndInit, 100)
    }
  }, [stepSlug])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value })
    if (errors[fieldId]) setErrors({ ...errors, [fieldId]: '' })
  }

  const handleRadioSelect = (value: string) => {
    const field = (currentStepData as any).field
    handleInputChange(field, value)
    if (currentStepData.autoAdvance) {
      setTimeout(() => router.push(`/${introducerSlug}/${steps[currentStepIndex + 1]}`), 300)
    }
  }

  const validateStep = async () => {
    const newErrors: Record<string, string> = {}
    if (stepSlug === 'p3') {
      const { dob_day, dob_month, dob_year } = formData
      if (!dob_day) newErrors.dob_day = 'Required'
      if (!dob_month) newErrors.dob_month = 'Required'
      if (!dob_year) newErrors.dob_year = 'Required'
      if (dob_day && dob_month && dob_year) {
        const d = parseInt(dob_day), m = parseInt(dob_month), y = parseInt(dob_year)
        if (d < 1 || d > 31) newErrors.dob_day = 'Invalid'
        if (m < 1 || m > 12) newErrors.dob_month = 'Invalid'
        if (y < 1900 || y > new Date().getFullYear()) newErrors.dob_year = 'Invalid'
        if (!Object.keys(newErrors).length) {
          const date = new Date(y, m - 1, d)
          if (isNaN(date.getTime()) || date.getDate() !== d) newErrors.date_of_birth = 'Invalid date'
          else if ((new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000) < 18) newErrors.date_of_birth = 'Must be 18+'
        }
      }
    }
    if (stepSlug === 'p4') {
      if (!formData.postcode) newErrors.postcode = 'Required'
      if (!formData.address_line1) newErrors.address_line1 = 'Required'
      if (!formData.city) newErrors.city = 'Required'
    }
    if (stepSlug === 'p5') {
      if (!formData.title) newErrors.title = 'Required'
      if (!formData.first_name) newErrors.first_name = 'Required'
      if (!formData.last_name) newErrors.last_name = 'Required'
    }
    if (stepSlug === 'p6') {
      if (!formData.email) newErrors.email = 'Required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid'
      if (!formData.phone) newErrors.phone = 'Required'
      else if (!formData.phone.replace(/\s/g, '').match(/^(07|01|02)\d{8,9}$/)) newErrors.phone = 'Must start 07/01/02'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!await validateStep()) return
    if (stepSlug === 'p6') {
      setLoading(true)
      try {
        sessionStorage.setItem(`claim_data_${introducerSlug}`, JSON.stringify({ ...formData, submitted_at: new Date().toISOString() }))
        await new Promise(resolve => setTimeout(resolve, 500))
        router.push(`/${introducerSlug}/checking`)
      } catch (error: any) {
        setErrors({ submit: error.message })
        setLoading(false)
      }
    } else {
      router.push(`/${introducerSlug}/${steps[currentStepIndex + 1]}`)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) router.push(`/${introducerSlug}/${steps[currentStepIndex - 1]}`)
    else router.push(`/${introducerSlug}`)
  }

  if (!currentStepData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Step not found</h1>
          <Link href={`/${introducerSlug}`} className="btn btn-primary">Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-card">
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Link href={`/${introducerSlug}`} className="text-2xl font-bold text-primary-orange">Claims Hub</Link>
        </div>
      </header>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-dark-muted">Step {currentStepIndex + 1} of {totalSteps}</span>
              <span className="text-sm text-dark-muted">{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-dark-card rounded-full h-2">
              <div className="bg-primary-orange h-2 rounded-full transition-all" style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }} />
            </div>
          </div>
          <div className="card">
            <h2 className="text-3xl font-bold mb-8">{currentStepData.title}</h2>
            {currentStepData.type === 'radio' && (
              <div className="space-y-4">
                {(currentStepData as any).options?.map((opt: string) => (
                  <button key={opt} onClick={() => handleRadioSelect(opt)}
                    className={`w-full p-6 rounded-lg border-2 transition-all text-left ${formData[(currentStepData as any).field] === opt ? 'border-primary-orange bg-primary-orange/10' : 'border-dark-border hover:border-primary-orange/50'}`}>
                    <span className="text-xl font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStepData.type === 'date' && (
              <div className="space-y-4">
                <p className="text-sm text-dark-muted text-center mb-6">For example 13/03/1989</p>
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" className={`input text-2xl text-center ${errors.dob_day ? 'input-error' : ''}`} placeholder="DD" value={formData.dob_day || ''} maxLength={2} onChange={(e) => handleInputChange('dob_day', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                  <input type="text" className={`input text-2xl text-center ${errors.dob_month ? 'input-error' : ''}`} placeholder="MM" value={formData.dob_month || ''} maxLength={2} onChange={(e) => handleInputChange('dob_month', e.target.value.replace(/\D/g, '').slice(0, 2))} />
                  <input type="text" className={`input text-2xl text-center ${errors.dob_year ? 'input-error' : ''}`} placeholder="YYYY" value={formData.dob_year || ''} maxLength={4} onChange={(e) => handleInputChange('dob_year', e.target.value.replace(/\D/g, '').slice(0, 4))} />
                </div>
                {(errors.date_of_birth || errors.dob_day || errors.dob_month || errors.dob_year) && <p className="error-message text-center">{errors.date_of_birth || errors.dob_day || errors.dob_month || errors.dob_year}</p>}
              </div>
            )}
            {currentStepData.type === 'address' && (
              <div className="space-y-4">
                <div className="form-group">
                  <label className="label label-required">Postcode</label>
                  <div className="flex gap-2 items-center">
                    <input type="text" id="postcode" className={`input ${errors.postcode ? 'input-error' : ''}`} placeholder="e.g. SW1A 1AA" value={formData.postcode || ''} onChange={(e) => handleInputChange('postcode', e.target.value.toUpperCase())} />
                  </div>
                  {errors.postcode && <p className="error-message">{errors.postcode}</p>}
                </div>
                <input type="hidden" id="line1" />
                <input type="hidden" id="line2" />
                <input type="hidden" id="city" />
                <input type="hidden" id="county" />
                {mounted && formData.address_line1 && (
                  <>
                    <div className="form-group">
                      <label className="label label-required">Address Line 1</label>
                      <input type="text" className={`input ${errors.address_line1 ? 'input-error' : ''}`} value={formData.address_line1} onChange={(e) => handleInputChange('address_line1', e.target.value)} />
                      {errors.address_line1 && <p className="error-message">{errors.address_line1}</p>}
                    </div>
                    <div className="form-group">
                      <label className="label">Address Line 2</label>
                      <input type="text" className="input" value={formData.address_line2 || ''} onChange={(e) => handleInputChange('address_line2', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="label label-required">Town/City</label>
                      <input type="text" className={`input ${errors.city ? 'input-error' : ''}`} value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} />
                      {errors.city && <p className="error-message">{errors.city}</p>}
                    </div>
                    <div className="form-group">
                      <label className="label">County</label>
                      <input type="text" className="input" value={formData.county || ''} onChange={(e) => handleInputChange('county', e.target.value)} />
                    </div>
                  </>
                )}
              </div>
            )}
            {currentStepData.type === 'name' && (
              <div className="space-y-6">
                <div className="form-group">
                  <label className="label label-required">Title</label>
                  <select className={`input ${errors.title ? 'input-error' : ''}`} value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)}>
                    <option value="">Select...</option>
                    <option>Mr</option><option>Mrs</option><option>Miss</option><option>Ms</option><option>Dr</option>
                  </select>
                  {errors.title && <p className="error-message">{errors.title}</p>}
                </div>
                <div className="form-group">
                  <label className="label label-required">First Name</label>
                  <input type="text" className={`input ${errors.first_name ? 'input-error' : ''}`} value={formData.first_name || ''} onChange={(e) => handleInputChange('first_name', e.target.value)} />
                  {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                </div>
                <div className="form-group">
                  <label className="label">Middle Name</label>
                  <input type="text" className="input" value={formData.middle_name || ''} onChange={(e) => handleInputChange('middle_name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label label-required">Last Name</label>
                  <input type="text" className={`input ${errors.last_name ? 'input-error' : ''}`} value={formData.last_name || ''} onChange={(e) => handleInputChange('last_name', e.target.value)} />
                  {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                </div>
              </div>
            )}
            {currentStepData.type === 'contact' && (
              <div className="space-y-6">
                <div className="form-group">
                  <label className="label label-required">Email</label>
                  <input type="email" className={`input ${errors.email ? 'input-error' : ''}`} placeholder="your@email.com" value={formData.email || ''} onChange={(e) => handleInputChange('email', e.target.value)} />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <div className="form-group">
                  <label className="label label-required">Phone</label>
                  <input type="tel" className={`input ${errors.phone ? 'input-error' : ''}`} placeholder="07123456789" value={formData.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
                <div className="p-4 bg-dark-bg rounded-lg border border-dark-border">
                  <div className="flex gap-3 items-start">
                    <div className="text-2xl">🔒</div>
                    <div className="text-sm text-dark-muted">
                      <p className="font-bold text-dark-text mb-2">Secure</p>
                      <p className="text-xs">By continuing, you agree to our Terms.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {errors.submit && <div className="mt-6 p-4 bg-red-500/20 border border-red-500 rounded-lg"><p className="text-red-400">{errors.submit}</p></div>}
            {!currentStepData.autoAdvance && (
              <div className="flex gap-4 mt-8">
                {currentStepIndex > 0 && <button type="button" className="btn btn-secondary" onClick={handleBack}>← Back</button>}
                <button type="button" className="btn btn-primary flex-1" onClick={handleNext} disabled={loading}>
                  {loading ? <span className="flex items-center gap-2"><span className="spinner"></span>Checking...</span> : (stepSlug === 'p6' ? 'Check Eligibility' : 'Continue →')}
                </button>
              </div>
            )}
          </div>
          <div className="mt-6 text-center text-sm text-dark-muted"><p>🔒 Secure</p></div>
        </div>
      </div>
    </div>
  )
}
