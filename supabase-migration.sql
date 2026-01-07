-- Complete Claims Table Schema
-- Run this in Supabase SQL Editor to create/update the claims table

-- Drop existing table if you want to start fresh (WARNING: deletes all data)
-- DROP TABLE IF EXISTS claims;

-- Drop old constraint if it exists
ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;

-- Create claims table with all required columns
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Claim info
  reference TEXT NOT NULL,
  introducer TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'pending', 'approved', 'rejected', 'duplicate')),
  submitted_at TIMESTAMPTZ,
  
  -- Personal info
  title TEXT,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  
  -- Date of birth (separate fields)
  dob_day TEXT,
  dob_month TEXT,
  dob_year TEXT,
  
  -- Contact
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Address
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  
  -- Finance info
  has_car_finance TEXT,
  multiple_vehicles TEXT,
  
  -- Signature
  signature TEXT
);

-- If table already exists, add missing columns
ALTER TABLE claims ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS introducer TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'submitted';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS middle_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS dob_day TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS dob_month TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS dob_year TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS county TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS postcode TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS has_car_finance TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS multiple_vehicles TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS signature TEXT;

-- Remove old date_of_birth column if it exists
ALTER TABLE claims DROP COLUMN IF EXISTS date_of_birth;

-- Update the status check constraint to allow 'submitted'
ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;
ALTER TABLE claims ADD CONSTRAINT claims_status_check 
  CHECK (status IN ('submitted', 'pending', 'approved', 'rejected', 'duplicate'));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_claims_reference ON claims(reference);
CREATE INDEX IF NOT EXISTS idx_claims_introducer ON claims(introducer);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
DROP POLICY IF EXISTS "Allow all operations" ON claims;
CREATE POLICY "Allow all operations" ON claims FOR ALL USING (true) WITH CHECK (true);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

