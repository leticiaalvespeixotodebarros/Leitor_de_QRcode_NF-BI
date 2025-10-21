// API route for sales time series data
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const groupBy = searchParams.get("group_by") || "day" // day, week, month

    let dateFormat = "YYYY-MM-DD"
    let dateTrunc = "day"

    if (groupBy === "week") {
      dateFormat = "YYYY-WW"
      dateTrunc = "week"
    } else if (groupBy === "month") {
      dateFormat = "YYYY-MM"
      dateTrunc = "month"
    }

    let query = sql`
      SELECT 
        DATE_TRUNC(${dateTrunc}, emission_date) as period,
        COUNT(*) as receipt_count,
        SUM(total_amount) as total_sales,
        AVG(total_amount) as average_ticket,
        SUM(discount_amount) as total_discounts
      FROM fiscal_receipts
    `

    // Add date filters if provided
    if (startDate && endDate) {
      query = sql`
        SELECT 
          DATE_TRUNC(${dateTrunc}, emission_date) as period,
          COUNT(*) as receipt_count,
          SUM(total_amount) as total_sales,
          AVG(total_amount) as average_ticket,
          SUM(discount_amount) as total_discounts
        FROM fiscal_receipts
        WHERE emission_date BETWEEN ${startDate} AND ${endDate}
        GROUP BY DATE_TRUNC(${dateTrunc}, emission_date)
        ORDER BY period
      `
    } else {
      query = sql`
        SELECT 
          DATE_TRUNC(${dateTrunc}, emission_date) as period,
          COUNT(*) as receipt_count,
          SUM(total_amount) as total_sales,
          AVG(total_amount) as average_ticket,
          SUM(discount_amount) as total_discounts
        FROM fiscal_receipts
        GROUP BY DATE_TRUNC(${dateTrunc}, emission_date)
        ORDER BY period
      `
    }

    const data = await query

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error fetching sales over time:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sales data" }, { status: 500 })
  }
}
