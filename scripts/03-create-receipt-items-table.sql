-- Phase 2: Table for storing individual items from fiscal receipts
-- This enables product-level analysis

CREATE TABLE IF NOT EXISTS receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES fiscal_receipts(id) ON DELETE CASCADE,
    item_number INTEGER NOT NULL,
    product_code VARCHAR(50),
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    quantity DECIMAL(10, 3) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    unit_of_measure VARCHAR(10),
    ncm_code VARCHAR(10), -- Nomenclatura Comum do Mercosul
    cfop_code VARCHAR(10), -- Código Fiscal de Operações e Prestações
    tax_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_receipt_item UNIQUE (receipt_id, item_number)
);

-- Indexes for analysis queries
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_product_name ON receipt_items(product_name);
CREATE INDEX IF NOT EXISTS idx_receipt_items_total_price ON receipt_items(total_price);

-- Add comments
COMMENT ON TABLE receipt_items IS 'Stores individual items from fiscal receipts for product-level analysis';
COMMENT ON COLUMN receipt_items.ncm_code IS 'Nomenclatura Comum do Mercosul - product classification code';
