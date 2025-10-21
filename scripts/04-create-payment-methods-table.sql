-- Phase 2: Table for storing payment method information
-- Enables payment analysis and comparison

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES fiscal_receipts(id) ON DELETE CASCADE,
    payment_type VARCHAR(50) NOT NULL, -- 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'PIX', etc.
    payment_amount DECIMAL(10, 2) NOT NULL,
    installments INTEGER DEFAULT 1,
    card_flag VARCHAR(50), -- Visa, Mastercard, etc.
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for payment analysis
CREATE INDEX IF NOT EXISTS idx_payment_methods_receipt_id ON payment_methods(receipt_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(payment_type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_date ON payment_methods(payment_date);

-- Add comments
COMMENT ON TABLE payment_methods IS 'Stores payment method information for each fiscal receipt';
COMMENT ON COLUMN payment_methods.payment_type IS 'Type of payment: Dinheiro, Cartão de Crédito, Cartão de Débito, PIX, etc.';
