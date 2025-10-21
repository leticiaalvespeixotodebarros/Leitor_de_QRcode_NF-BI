-- Migration: Fix scan_method constraint to allow 'manual' input
-- This allows users to manually enter fiscal keys in addition to webcam/upload

-- Drop the old constraint
ALTER TABLE fiscal_keys DROP CONSTRAINT IF EXISTS fiscal_keys_scan_method_check;

-- Add new constraint that includes 'manual'
ALTER TABLE fiscal_keys ADD CONSTRAINT fiscal_keys_scan_method_check 
  CHECK (scan_method IN ('webcam', 'upload', 'manual'));

-- Add comment for documentation
COMMENT ON COLUMN fiscal_keys.scan_method IS 'Method used to capture the fiscal key: webcam, upload, or manual entry';
