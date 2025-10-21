// API route for managing fiscal receipts
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET: Retrieve all receipts with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const receipts = await sql`
      SELECT 
        fr.*,
        COUNT(ri.id) as item_count,
        COALESCE(SUM(pm.payment_amount), 0) as total_payments
      FROM fiscal_receipts fr
      LEFT JOIN receipt_items ri ON fr.id = ri.receipt_id
      LEFT JOIN payment_methods pm ON fr.id = pm.receipt_id
      GROUP BY fr.id
      ORDER BY fr.emission_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await sql`SELECT COUNT(*) as total FROM fiscal_receipts`
    const total = Number.parseInt(countResult[0].total)

    return NextResponse.json({ success: true, data: receipts, total })
  } catch (error) {
    console.error("[v0] Error fetching receipts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch receipts" }, { status: 500 })
  }
}

// POST: Create a new receipt with items and payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { receipt, items, payments } = body

    // Validate required fields
    if (!receipt.access_key || !receipt.emission_date || !receipt.total_amount) {
      return NextResponse.json({ success: false, error: "Missing required receipt fields" }, { status: 400 })
    }

    // Check if access key exists in fiscal_keys table
    const keyExists = await sql`
      SELECT id FROM fiscal_keys WHERE access_key = ${receipt.access_key}
    `

    if (keyExists.length === 0) {
      return NextResponse.json(
        { success: false, error: "Access key not found. Please scan the QR code first." },
        { status: 404 },
      )
    }

    // Check for duplicate receipt
    const existingReceipt = await sql`
      SELECT id FROM fiscal_receipts WHERE access_key = ${receipt.access_key}
    `

    if (existingReceipt.length > 0) {
      return NextResponse.json(
        { success: false, error: "Receipt already exists for this access key", duplicate: true },
        { status: 409 },
      )
    }

    // Insert receipt
    const receiptResult = await sql`
      INSERT INTO fiscal_receipts (
        access_key, receipt_number, series, emission_date,
        establishment_name, establishment_cnpj, establishment_address,
        total_amount, discount_amount, tax_amount, xml_data
      ) VALUES (
        ${receipt.access_key},
        ${receipt.receipt_number || null},
        ${receipt.series || null},
        ${receipt.emission_date},
        ${receipt.establishment_name || null},
        ${receipt.establishment_cnpj || null},
        ${receipt.establishment_address || null},
        ${receipt.total_amount},
        ${receipt.discount_amount || 0},
        ${receipt.tax_amount || 0},
        ${receipt.xml_data || null}
      )
      RETURNING id
    `

    const receiptId = receiptResult[0].id

    // Insert items if provided
    if (items && items.length > 0) {
      for (const item of items) {
        await sql`
          INSERT INTO receipt_items (
            receipt_id, item_number, product_code, product_name,
            product_description, quantity, unit_price, total_price,
            unit_of_measure, ncm_code, cfop_code, tax_rate
          ) VALUES (
            ${receiptId},
            ${item.item_number},
            ${item.product_code || null},
            ${item.product_name},
            ${item.product_description || null},
            ${item.quantity},
            ${item.unit_price},
            ${item.total_price},
            ${item.unit_of_measure || null},
            ${item.ncm_code || null},
            ${item.cfop_code || null},
            ${item.tax_rate || null}
          )
        `
      }
    }

    // Insert payments if provided
    if (payments && payments.length > 0) {
      for (const payment of payments) {
        await sql`
          INSERT INTO payment_methods (
            receipt_id, payment_type, payment_amount,
            installments, card_flag
          ) VALUES (
            ${receiptId},
            ${payment.payment_type},
            ${payment.payment_amount},
            ${payment.installments || 1},
            ${payment.card_flag || null}
          )
        `
      }
    }

    return NextResponse.json({ success: true, data: { id: receiptId } })
  } catch (error) {
    console.error("[v0] Error creating receipt:", error)
    return NextResponse.json({ success: false, error: "Failed to create receipt" }, { status: 500 })
  }
}
