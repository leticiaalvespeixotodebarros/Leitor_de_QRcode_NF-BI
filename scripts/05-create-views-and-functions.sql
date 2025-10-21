-- Create useful views and functions for BI analysis

-- View: Daily sales summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(emission_date) as sale_date,
    COUNT(*) as total_receipts,
    SUM(total_amount) as total_sales,
    AVG(total_amount) as average_ticket,
    SUM(discount_amount) as total_discounts
FROM fiscal_receipts
GROUP BY DATE(emission_date)
ORDER BY sale_date DESC;

-- View: Top products by revenue
CREATE OR REPLACE VIEW top_products_by_revenue AS
SELECT 
    ri.product_name,
    COUNT(DISTINCT ri.receipt_id) as times_sold,
    SUM(ri.quantity) as total_quantity,
    SUM(ri.total_price) as total_revenue,
    AVG(ri.unit_price) as average_price
FROM receipt_items ri
GROUP BY ri.product_name
ORDER BY total_revenue DESC;

-- View: Payment method distribution
CREATE OR REPLACE VIEW payment_method_distribution AS
SELECT 
    pm.payment_type,
    COUNT(*) as transaction_count,
    SUM(pm.payment_amount) as total_amount,
    AVG(pm.payment_amount) as average_amount,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM payment_methods pm
GROUP BY pm.payment_type
ORDER BY total_amount DESC;

-- Function: Get sales by date range
CREATE OR REPLACE FUNCTION get_sales_by_date_range(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    emission_date DATE,
    total_receipts BIGINT,
    total_sales NUMERIC,
    average_ticket NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(fr.emission_date) as emission_date,
        COUNT(*)::BIGINT as total_receipts,
        SUM(fr.total_amount) as total_sales,
        AVG(fr.total_amount) as average_ticket
    FROM fiscal_receipts fr
    WHERE DATE(fr.emission_date) BETWEEN start_date AND end_date
    GROUP BY DATE(fr.emission_date)
    ORDER BY emission_date;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON VIEW daily_sales_summary IS 'Daily aggregated sales metrics for BI dashboard';
COMMENT ON VIEW top_products_by_revenue IS 'Products ranked by total revenue for analysis';
COMMENT ON VIEW payment_method_distribution IS 'Payment method usage statistics';
