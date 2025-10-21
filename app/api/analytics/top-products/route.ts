// API route for top products analysis
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query

    if (startDate && endDate) {
      query = sql`
        SELECT 
          ri.product_name,
          ri.product_code,
          COUNT(DISTINCT ri.receipt_id) as times_sold,
          SUM(ri.quantity) as total_quantity,
          SUM(ri.total_price) as total_revenue,
          AVG(ri.unit_price) as average_price
        FROM receipt_items ri
        JOIN fiscal_receipts fr ON ri.receipt_id = fr.id
        WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY ri.product_name, ri.product_code
        ORDER BY total_revenue DESC
        LIMIT ${limit}
      `
    } else {
      query = sql`
        SELECT 
          ri.product_name,
          ri.product_code,
          COUNT(DISTINCT ri.receipt_id) as times_sold,
          SUM(ri.quantity) as total_quantity,
          SUM(ri.total_price) as total_revenue,
          AVG(ri.unit_price) as average_price
        FROM receipt_items ri
        GROUP BY ri.product_name, ri.product_code
        ORDER BY total_revenue DESC
        LIMIT ${limit}
      `
    }

    const data = await query

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error fetching top products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch top products" }, { status: 500 })
  }
}
