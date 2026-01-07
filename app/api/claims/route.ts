import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Extract DOB parts if date_of_birth is a string
    let dobDay, dobMonth, dobYear
    if (data.date_of_birth && typeof data.date_of_birth === 'string') {
      const parts = data.date_of_birth.split('/')
      dobDay = parts[0]
      dobMonth = parts[1]
      dobYear = parts[2]
    }
    
    const claimData = {
      reference: data.reference,
      introducer: data.introducer,
      title: data.title,
      first_name: data.first_name,
      middle_name: data.middle_name || '',
      last_name: data.last_name,
      dob_day: data.dob_day || dobDay,
      dob_month: data.dob_month || dobMonth,
      dob_year: data.dob_year || dobYear,
      email: data.email,
      phone: data.phone,
      address_line1: data.address_line1,
      address_line2: data.address_line2 || '',
      city: data.city,
      county: data.county || '',
      postcode: data.postcode,
      has_car_finance: data.has_car_finance,
      multiple_vehicles: data.multiple_vehicles,
      signature: data.signature,
      status: 'submitted',
      submitted_at: data.submitted_at
    }

    console.log('Saving to Supabase:', claimData)

    const { data: inserted, error } = await supabase
      .from('claims')
      .insert([claimData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, claim: inserted })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const introducer = searchParams.get('introducer')

    let query = supabase.from('claims').select('*').order('created_at', { ascending: false })
    
    if (introducer) {
      query = query.eq('introducer', introducer)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ claims: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
