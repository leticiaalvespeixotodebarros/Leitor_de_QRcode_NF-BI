// API route for dashboard summary statistics
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let receiptQuery, itemQuery, paymentQuery

    if (startDate && endDate) {
      receiptQuery = sql`
        SELECT 
          COUNT(*) as total_receipts,
          SUM(total_amount) as total_sales,
          AVG(total_amount) as average_ticket,
          SUM(discount_amount) as total_discounts
        FROM fiscal_receipts
        WHERE emission_date BETWEEN ${startDate} AND ${endDate}
      `

      itemQuery = sql`
        SELECT COUNT(DISTINCT product_name) as unique_products
        FROM receipt_items ri
        JOIN fiscal_receipts fr ON ri.receipt_id = fr.id
        WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
      `

      paymentQuery = sql`
        SELECT COUNT(DISTINCT payment_type) as payment_types
        FROM payment_methods pm
        JOIN fiscal_receipts fr ON pm.receipt_id = fr.id
        WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
      `
    } else {
      receiptQuery = sql`
        SELECT 
          COUNT(*) as total_receipts,
          SUM(total_amount) as total_sales,
          AVG(total_amount) as average_ticket,
          SUM(discount_amount) as total_discounts
        FROM fiscal_receipts
      `

      itemQuery = sql`
        SELECT COUNT(DISTINCT product_name) as unique_products
        FROM receipt_items
      `

      paymentQuery = sql`
        SELECT COUNT(DISTINCT payment_type) as payment_types
        FROM payment_methods
      `
    }

    const [receiptData, itemData, paymentData] = await Promise.all([receiptQuery, itemQuery, paymentQuery])

    const summary = {
      total_receipts: Number.parseInt(receiptData[0]?.total_receipts || "0"),
      total_sales: Number.parseFloat(receiptData[0]?.total_sales || "0"),
      average_ticket: Number.parseFloat(receiptData[0]?.average_ticket || "0"),
      total_discounts: Number.parseFloat(receiptData[0]?.total_discounts || "0"),
      unique_products: Number.parseInt(itemData[0]?.unique_products || "0"),
      payment_types: Number.parseInt(paymentData[0]?.payment_types || "0"),
    }

    return NextResponse.json({ success: true, data: summary })
  } catch (error) {
    console.error("[v0] Error fetching summary:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch summary" }, { status: 500 })
  }
}
