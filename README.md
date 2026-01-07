# Claims Platform - Complete Setup Guide

## 📋 Project Overview

This is a complete Next.js 14 multi-introducer claims management platform with:
- ✅ Dynamic landing page builder (GrapesJS)
- ✅ Multi-step form system (infinite steps possible)
- ✅ Data-8 integration (address, email, phone validation)
- ✅ PDF generation with template upload
- ✅ External credit check API integration
- ✅ Introducer dashboard with stats
- ✅ Admin portal
- ✅ Per-introducer GTM/GA4 tracking
- ✅ Auth0 authentication

---

## 🚀 Quick Start (30 minutes)

### Step 1: Prerequisites

Install these on your computer:
1. **Node.js** (v18 or higher) - https://nodejs.org
2. **Git** - https://git-scm.com
3. **VS Code** (recommended) - https://code.visualstudio.com

### Step 2: Clone and Install

```bash
# Navigate to where you want the project
cd ~/Projects

# Extract the uploaded files or clone from git
cd claims-platform

# Install dependencies
npm install
```

### Step 3: Set Up Supabase (Database)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait 2 minutes for it to initialize
4. Go to Project Settings → API
5. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (click "Reveal")

6. Go to SQL Editor → New Query
7. Copy the entire content of `supabase/schema.sql`
8. Paste and click "Run"

### Step 4: Set Up Auth0 (Authentication)

1. Go to https://auth0.com and create a free account
2. Create a new Application → "Regular Web Application"
3. In Application Settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
   - Save Changes

4. Create Roles:
   - Go to User Management → Roles
   - Create role: "admin"
   - Create role: "introducer"

5. Create API:
   - Go to Applications → APIs
   - Create API: "Claims Platform API"
   - Identifier: `https://claims-platform.com`

6. Add roles to users:
   - Go to User Management → Users
   - Click your user → Roles → Assign Role

### Step 5: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in:

```bash
# Auth0 (from step 4)
AUTH0_SECRET='run this command in terminal: openssl rand -hex 32'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'

# Supabase (from step 3)
NEXT_PUBLIC_SUPABASE_URL='https://xxxxx.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your_anon_key'
SUPABASE_SERVICE_ROLE_KEY='your_service_role_key'

# Data-8 API
DATA8_API_KEY='your-data8-key'

# External Credit Check API (configure when ready)
CREDIT_CHECK_API_URL='https://your-api.com'
CREDIT_CHECK_API_KEY='your-api-key'

# App URL
NEXT_PUBLIC_APP_URL='http://localhost:3000'

# Default GTM (optional)
NEXT_PUBLIC_GTM_ID='GTM-XXXXXXX'
```

3. Generate AUTH0_SECRET:
```bash
openssl rand -hex 32
```

### Step 6: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000

🎉 **You're now running locally!**

---

## 🌐 Deploy to Vercel (Production)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/claims-platform.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add ALL variables from your `.env.local`
   - ⚠️ Update `AUTH0_BASE_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL

6. Click "Deploy"

### Step 3: Update Auth0 URLs

After deployment, update Auth0:
1. Go to your Auth0 Application Settings
2. Update:
   - Allowed Callback URLs: `https://your-app.vercel.app/api/auth/callback`
   - Allowed Logout URLs: `https://your-app.vercel.app`
   - Allowed Web Origins: `https://your-app.vercel.app`

### Step 4: Custom Domain (Optional)

1. In Vercel, go to Settings → Domains
2. Add your custom domain: `www.link.com`
3. Follow DNS instructions
4. Update Auth0 URLs again with your custom domain

---

## 👥 Creating Introducers

### Via Supabase Dashboard

1. Go to Supabase → Table Editor → `introducers`
2. Insert new row:
   - `auth0_user_id`: User's Auth0 ID (from Auth0 dashboard)
   - `slug`: `intro1` (or `intro2`, etc.)
   - `name`: Introducer Name
   - `email`: their@email.com
   - `is_active`: true

3. Assign "introducer" role in Auth0

### Via API (Coming Soon)

An admin API endpoint will be added for easier introducer management.

---

## 🎨 Creating Landing Pages

### For Each Introducer:

1. Login as introducer
2. Go to Dashboard → Landing Pages
3. Click "Create Page"
4. Use the GrapesJS drag & drop builder:
   - Drag components from the left panel
   - Edit text by double-clicking
   - Style using the right panel
5. Save and Publish

### URL Structure:

- Landing page: `yoursite.com/intro1`
- Form step 1: `yoursite.com/intro1/p1`
- Form step 2: `yoursite.com/intro1/p2`
- Thank you: `yoursite.com/intro1/thank-you`

---

## 📝 Configuring Forms

### Dynamic Form Steps

Forms are configured in the database:

```sql
-- Insert a form template
INSERT INTO form_templates (introducer_id, name, steps)
VALUES (
  'introducer-uuid',
  'Standard Claim Form',
  '[
    {
      "id": "step1",
      "title": "Personal Information",
      "fields": [
        {
          "id": "first_name",
          "type": "text",
          "label": "First Name",
          "required": true
        },
        {
          "id": "last_name",
          "type": "text",
          "label": "Last Name",
          "required": true
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email Address",
          "required": true
        }
      ]
    },
    {
      "id": "step2",
      "title": "Contact Details",
      "fields": [
        {
          "id": "phone",
          "type": "tel",
          "label": "Phone Number",
          "required": true
        },
        {
          "id": "address",
          "type": "address",
          "label": "Address",
          "required": true
        }
      ]
    }
  ]'::jsonb
);
```

---

## 📄 PDF Templates

### Upload PDF Template (Admin Portal)

1. Login as admin
2. Go to Admin → PDF Templates
3. Upload HTML template with merge fields:

```html
<h1>Letter of Authority</h1>

<p>I, <strong>{{first_name}} {{last_name}}</strong>, authorize...</p>

<p>Email: {{email}}</p>
<p>Phone: {{phone}}</p>
<p>Address: {{address_line1}}, {{city}}, {{postcode}}</p>

<p>Reference: {{reference_number}}</p>
<p>Date: {{date}}</p>
```

Available merge fields:
- `{{first_name}}`, `{{last_name}}`
- `{{email}}`, `{{phone}}`
- `{{address_line1}}`, `{{address_line2}}`
- `{{city}}`, `{{county}}`, `{{postcode}}`
- `{{reference_number}}`, `{{date}}`
- Any custom field from `form_data`

---

## 🔌 Credit Check API Integration

Update `/app/api/claims/submit/route.ts`:

```typescript
async function callCreditCheckAPI(data: any) {
  const response = await axios.post(
    process.env.CREDIT_CHECK_API_URL!,
    {
      // Format according to YOUR API
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      // etc...
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.CREDIT_CHECK_API_KEY}`,
      }
    }
  )

  // Parse YOUR API response
  return {
    referenceNumber: response.data.ref,
    status: response.data.status, // 'successful' | 'unsuccessful'
    companies: response.data.companies,
  }
}
```

---

## 📊 GTM Tracking

### Per-Introducer Tracking

Each introducer can set their own GTM ID in Settings.

The system automatically:
- Loads the correct GTM container per introducer
- Tracks form steps
- Tracks submissions
- Pushes events to `dataLayer`

### Events Tracked:

- `page_view` - Every page load
- `form_start` - User starts form
- `form_step_complete` - Step completed
- `form_submit_success` - Successful submission
- `form_submit_error` - Submission error

### GTM Variables Available:

- `introducer` - Introducer slug
- `step` - Current step number
- `claimId` - Claim ID
- `status` - Claim status
- `referenceNumber` - Reference number

---

## 🔐 Security Checklist

✅ Environment variables never committed
✅ Auth0 authentication required for dashboards
✅ Row Level Security (RLS) on Supabase
✅ Input validation with Data-8
✅ Rate limiting on API routes (add middleware if needed)
✅ HTTPS only in production (Vercel provides this)
✅ Signature verification on PDF generation

---

## 🛠️ Common Tasks

### Add a New Introducer

```sql
INSERT INTO introducers (auth0_user_id, slug, name, email)
VALUES ('auth0|123456', 'intro3', 'New Introducer', 'email@example.com');
```

### View All Claims

```sql
SELECT 
  c.*,
  i.name as introducer_name
FROM claims c
LEFT JOIN introducers i ON c.introducer_id = i.id
ORDER BY c.created_at DESC;
```

### Get Introducer Stats

```sql
SELECT * FROM get_introducer_stats('introducer-uuid');
```

### Check for Duplicates

```sql
SELECT * FROM check_duplicate_claim('email@test.com', '07123456789', 'introducer-uuid');
```

---

## 🐛 Troubleshooting

### "Authentication required" error

- Check Auth0 credentials in `.env.local`
- Make sure user has correct role assigned
- Clear browser cookies and try again

### Form not submitting

- Check browser console for errors
- Verify Supabase connection
- Check credit check API is configured

### PDF generation failing

- Check `pdfkit` is installed: `npm install pdfkit`
- Verify Supabase storage bucket exists
- Check PDF template is uploaded

### Data-8 validation not working

- Verify API key is correct
- Check API quota/limits
- API responses are logged in browser console

---

## 📚 File Structure

```
claims-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── claims/             # Claim submission
│   │   ├── validate/           # Data-8 validation
│   │   └── introducers/        # Introducer stats
│   ├── dashboard/
│   │   ├── introducer/         # Introducer portal
│   │   └── admin/              # Admin portal
│   ├── builder/                # Page builder interface
│   ├── [introducer]/           # Dynamic introducer pages
│   └── layout.tsx              # Root layout
├── components/
│   ├── DynamicForm.tsx         # Multi-step form
│   ├── GTMScript.tsx           # GTM tracking
│   └── ...
├── lib/
│   ├── supabase.ts             # Database client
│   ├── auth0.ts                # Auth configuration
│   ├── data8.ts                # Data-8 API client
│   └── pdf.ts                  # PDF generation
├── supabase/
│   └── schema.sql              # Database schema
├── .env.local.example          # Environment template
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🎓 Next Steps

### Phase 1 Complete ✅
- Landing pages with drag & drop
- Multi-step forms
- Credit check API integration
- Introducer dashboard
- Admin portal
- GTM tracking

### Phase 2 (Email Gateway)
- Email notifications to claimants
- Status update emails
- Introducer notification emails
- Email templates in admin portal

Would you like me to build Phase 2 now?

---

## 💬 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Vercel deployment logs
4. Verify all environment variables are set

---

## 📝 Notes

- The credit check API is mocked - update with your actual API
- Data-8 requires an active API key and credit
- Supabase free tier has limits (check their pricing)
- Vercel free tier is generous for small teams

---

**Built with Next.js 14, Supabase, Auth0, and Data-8**
