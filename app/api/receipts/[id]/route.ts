// API route for individual receipt operations
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Get receipt details
    const receipt = await sql`
      SELECT * FROM fiscal_receipts WHERE id = ${id}
    `

    if (receipt.length === 0) {
      return NextResponse.json({ success: false, error: "Receipt not found" }, { status: 404 })
    }

    // Get items
    const items = await sql`
      SELECT * FROM receipt_items WHERE receipt_id = ${id} ORDER BY item_number
    `

    // Get payments
    const payments = await sql`
      SELECT * FROM payment_methods WHERE receipt_id = ${id}
    `

    return NextResponse.json({
      success: true,
      data: {
        receipt: receipt[0],
        items,
        payments,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching receipt:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch receipt" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Delete receipt (cascade will handle items and payments)
    await sql`
      DELETE FROM fiscal_receipts WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting receipt:", error)
    return NextResponse.json({ success: false, error: "Failed to delete receipt" }, { status: 500 })
  }
}
