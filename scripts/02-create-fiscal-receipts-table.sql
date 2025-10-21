-- Phase 2: Table for storing complete fiscal receipt data
-- This stores the main receipt information after data ingestion

CREATE TABLE IF NOT EXISTS fiscal_receipts (
    id SERIAL PRIMARY KEY,
    access_key VARCHAR(44) NOT NULL UNIQUE REFERENCES fiscal_keys(access_key),
    receipt_number VARCHAR(50),
    series VARCHAR(10),
    emission_date TIMESTAMP NOT NULL,
    establishment_name VARCHAR(255),
    establishment_cnpj VARCHAR(18),
    establishment_address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    receipt_status VARCHAR(20) DEFAULT 'active',
    xml_data TEXT, -- Store complete XML if needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fiscal_receipts_emission_date ON fiscal_receipts(emission_date);
CREATE INDEX IF NOT EXISTS idx_fiscal_receipts_establishment ON fiscal_receipts(establishment_cnpj);
CREATE INDEX IF NOT EXISTS idx_fiscal_receipts_total_amount ON fiscal_receipts(total_amount);

-- Add comments
COMMENT ON TABLE fiscal_receipts IS 'Stores complete fiscal receipt data from NFC-e';
COMMENT ON COLUMN fiscal_receipts.access_key IS 'References the access key from fiscal_keys table';
