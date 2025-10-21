-- Phase 1: Table for storing fiscal receipt access keys (chave de acesso)
-- This table prevents duplicate QR code entries

CREATE TABLE IF NOT EXISTS fiscal_keys (
    id SERIAL PRIMARY KEY,
    access_key VARCHAR(44) NOT NULL UNIQUE, -- Chave de acesso (44 characters)
    qr_code_url TEXT, -- Full QR code URL if available
    scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_method VARCHAR(20) CHECK (scan_method IN ('webcam', 'upload')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups and duplicate prevention
CREATE INDEX IF NOT EXISTS idx_fiscal_keys_access_key ON fiscal_keys(access_key);
CREATE INDEX IF NOT EXISTS idx_fiscal_keys_scan_date ON fiscal_keys(scan_date);

-- Add comment for documentation
COMMENT ON TABLE fiscal_keys IS 'Stores fiscal receipt access keys from QR codes with duplicate prevention';
COMMENT ON COLUMN fiscal_keys.access_key IS 'Unique 44-character fiscal receipt access key (chave de acesso)';
