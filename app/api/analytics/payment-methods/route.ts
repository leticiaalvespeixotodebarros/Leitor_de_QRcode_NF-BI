// API route for payment method analysis
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query

    if (startDate && endDate) {
      query = sql`
        SELECT 
          pm.payment_type,
          COUNT(*) as transaction_count,
          SUM(pm.payment_amount) as total_amount,
          AVG(pm.payment_amount) as average_amount,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM payment_methods pm
        JOIN fiscal_receipts fr ON pm.receipt_id = fr.id
        WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY pm.payment_type
        ORDER BY total_amount DESC
      `
    } else {
      query = sql`
        SELECT 
          pm.payment_type,
          COUNT(*) as transaction_count,
          SUM(pm.payment_amount) as total_amount,
          AVG(pm.payment_amount) as average_amount,
          ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
        FROM payment_methods pm
        GROUP BY pm.payment_type
        ORDER BY total_amount DESC
      `
    }

    const data = await query

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error fetching payment methods:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payment methods" }, { status: 500 })
  }
}
