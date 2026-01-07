-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Introducers Table
CREATE TABLE introducers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_user_id TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company TEXT,
  gtm_id TEXT,
  ga4_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Landing Pages Table (for drag & drop builder)
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  introducer_id UUID REFERENCES introducers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  step_number INTEGER DEFAULT 0, -- 0 for main landing, 1,2,3 for steps
  title TEXT,
  grapesjs_data JSONB, -- Full GrapesJS editor data
  html TEXT, -- Rendered HTML
  css TEXT, -- Compiled CSS
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(introducer_id, slug, step_number)
);

-- Claims Table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  introducer_id UUID REFERENCES introducers(id) ON DELETE SET NULL,
  reference_number TEXT UNIQUE, -- From credit check API
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Address (from Data-8)
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  county TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'UK',
  address_verified BOOLEAN DEFAULT false,
  
  -- Form Data (dynamic fields)
  form_data JSONB, -- All form responses stored here
  
  -- Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'successful', 'unsuccessful', 'dupe')),
  claim_companies JSONB, -- Array of companies with claims
  duplicate_of UUID REFERENCES claims(id), -- If dupe, reference to original
  
  -- PDF Letter of Authority
  pdf_url TEXT,
  signature_data TEXT, -- Base64 signature image
  
  -- API Response
  credit_check_response JSONB, -- Full API response
  credit_check_at TIMESTAMPTZ,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Form Templates Table (for dynamic multi-step forms)
CREATE TABLE form_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  introducer_id UUID REFERENCES introducers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL, -- Array of step configurations
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PDF Templates Table (admin uploads)
CREATE TABLE pdf_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Supabase storage URL
  template_fields JSONB, -- Available merge fields {{firstname}}, etc.
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracking Events Table
CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  introducer_id UUID REFERENCES introducers(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'page_view', 'form_start', 'form_submit', 'step_complete'
  page_path TEXT,
  step_number INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_claims_introducer ON claims(introducer_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_reference ON claims(reference_number);
CREATE INDEX idx_claims_email ON claims(email);
CREATE INDEX idx_claims_created ON claims(created_at DESC);
CREATE INDEX idx_tracking_introducer ON tracking_events(introducer_id);
CREATE INDEX idx_tracking_claim ON tracking_events(claim_id);
CREATE INDEX idx_landing_pages_introducer ON landing_pages(introducer_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE introducers ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Introducers can only see their own data
CREATE POLICY "Introducers can view own data"
  ON introducers FOR SELECT
  USING (auth0_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Introducers can update own data"
  ON introducers FOR UPDATE
  USING (auth0_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Landing pages policies
CREATE POLICY "Introducers can manage own pages"
  ON landing_pages FOR ALL
  USING (
    introducer_id IN (
      SELECT id FROM introducers 
      WHERE auth0_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Public can view published landing pages
CREATE POLICY "Public can view published pages"
  ON landing_pages FOR SELECT
  USING (published = true);

-- Claims policies
CREATE POLICY "Introducers can view own claims"
  ON claims FOR SELECT
  USING (
    introducer_id IN (
      SELECT id FROM introducers 
      WHERE auth0_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Admin functions (you'll set these via service role)
-- These bypass RLS for admin operations

-- Function to get introducer stats
CREATE OR REPLACE FUNCTION get_introducer_stats(introducer_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_claims', COUNT(*),
    'successful', COUNT(*) FILTER (WHERE status = 'successful'),
    'unsuccessful', COUNT(*) FILTER (WHERE status = 'unsuccessful'),
    'duplicates', COUNT(*) FILTER (WHERE status = 'dupe'),
    'pending', COUNT(*) FILTER (WHERE status = 'pending'),
    'conversion_rate', 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE status = 'successful')::NUMERIC / COUNT(*) * 100), 2)
        ELSE 0 
      END
  )
  INTO result
  FROM claims
  WHERE introducer_id = introducer_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for duplicate claims
CREATE OR REPLACE FUNCTION check_duplicate_claim(
  p_email TEXT,
  p_phone TEXT,
  p_introducer_id UUID
)
RETURNS UUID AS $$
DECLARE
  existing_claim_id UUID;
BEGIN
  SELECT id INTO existing_claim_id
  FROM claims
  WHERE (email = p_email OR phone = p_phone)
    AND status IN ('successful', 'pending')
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN existing_claim_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_introducers_updated_at BEFORE UPDATE ON introducers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default PDF template placeholder
INSERT INTO pdf_templates (name, description, file_url, template_fields, is_default)
VALUES (
  'Default Letter of Authority',
  'Standard letter of authority template',
  '/templates/default-loa.html',
  '["firstname", "lastname", "email", "phone", "address_line1", "address_line2", "city", "postcode", "date", "reference_number"]'::jsonb,
  true
);

-- Create storage buckets (run these in Supabase Storage dashboard)
-- 1. pdf-templates (for uploaded PDF templates)
-- 2. generated-pdfs (for generated letters of authority)
-- 3. signatures (for signature images)

COMMENT ON TABLE introducers IS 'Introducer/affiliate users who generate leads';
COMMENT ON TABLE landing_pages IS 'Customizable landing pages built with GrapesJS';
COMMENT ON TABLE claims IS 'Submitted claims with all personal and tracking data';
COMMENT ON TABLE form_templates IS 'Dynamic multi-step form configurations';
COMMENT ON TABLE pdf_templates IS 'Uploadable PDF templates with merge fields';
COMMENT ON TABLE tracking_events IS 'Analytics and user journey tracking';
