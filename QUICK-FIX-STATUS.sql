-- QUICK FIX for status check constraint error
-- Run this in Supabase SQL Editor NOW

-- Drop the existing constraint
ALTER TABLE claims DROP CONSTRAINT IF EXISTS claims_status_check;

-- Add new constraint that allows 'submitted' status
ALTER TABLE claims ADD CONSTRAINT claims_status_check 
  CHECK (status IN ('submitted', 'pending', 'approved', 'rejected', 'duplicate'));

-- Refresh schema
NOTIFY pgrst, 'reload schema';
