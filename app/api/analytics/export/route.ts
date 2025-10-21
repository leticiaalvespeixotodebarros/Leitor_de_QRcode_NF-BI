// API route for exporting data to CSV
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "receipts"
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let data: any[] = []
    let filename = "export.csv"
    let headers: string[] = []

    if (type === "receipts") {
      filename = "receipts.csv"
      if (startDate && endDate) {
        data = await sql`
          SELECT * FROM fiscal_receipts
          WHERE emission_date BETWEEN ${startDate} AND ${endDate}
          ORDER BY emission_date DESC
        `
      } else {
        data = await sql`SELECT * FROM fiscal_receipts ORDER BY emission_date DESC LIMIT 1000`
      }
      headers = [
        "id",
        "access_key",
        "receipt_number",
        "emission_date",
        "establishment_name",
        "total_amount",
        "discount_amount",
      ]
    } else if (type === "items") {
      filename = "items.csv"
      if (startDate && endDate) {
        data = await sql`
          SELECT ri.* FROM receipt_items ri
          JOIN fiscal_receipts fr ON ri.receipt_id = fr.id
          WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
          ORDER BY ri.receipt_id, ri.item_number
        `
      } else {
        data = await sql`SELECT * FROM receipt_items ORDER BY receipt_id, item_number LIMIT 1000`
      }
      headers = ["id", "receipt_id", "product_name", "quantity", "unit_price", "total_price"]
    } else if (type === "payments") {
      filename = "payments.csv"
      if (startDate && endDate) {
        data = await sql`
          SELECT pm.* FROM payment_methods pm
          JOIN fiscal_receipts fr ON pm.receipt_id = fr.id
          WHERE fr.emission_date BETWEEN ${startDate} AND ${endDate}
          ORDER BY pm.receipt_id
        `
      } else {
        data = await sql`SELECT * FROM payment_methods ORDER BY receipt_id LIMIT 1000`
      }
      headers = ["id", "receipt_id", "payment_type", "payment_amount", "installments"]
    }

    // Generate CSV
    const csvRows = [headers.join(",")]

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header]
        // Escape commas and quotes
        if (value === null || value === undefined) return ""
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      csvRows.push(values.join(","))
    }

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting data:", error)
    return NextResponse.json({ success: false, error: "Failed to export data" }, { status: 500 })
  }
}
