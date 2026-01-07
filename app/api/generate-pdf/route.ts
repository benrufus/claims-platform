import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const pdfContent = `CLAIM FORM SUBMISSION

Reference: ${data.reference || 'CLM-' + Date.now()}
Submitted: ${new Date().toLocaleString('en-GB')}

═══════════════════════════════════════════════════════════════

PERSONAL INFORMATION

Name: ${data.title} ${data.first_name} ${data.middle_name || ''} ${data.last_name}
Date of Birth: ${data.dob_day}/${data.dob_month}/${data.dob_year}

CONTACT DETAILS

Email: ${data.email}
Phone: ${data.phone}

ADDRESS

${data.address_line1}
${data.address_line2 ? data.address_line2 + '\n' : ''}${data.city}
${data.county ? data.county + '\n' : ''}${data.postcode}

FINANCE HISTORY

Car Finance: ${data.has_car_finance}
Multiple Vehicles: ${data.multiple_vehicles}

═══════════════════════════════════════════════════════════════

This claim has been digitally signed and submitted.

Signature: [Digital signature attached]
    `

    return new NextResponse(pdfContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="claim-${Date.now()}.txt"`
      }
    })
  } catch (error: any) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
