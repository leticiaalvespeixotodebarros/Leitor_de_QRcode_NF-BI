// API route for managing fiscal keys
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET: Retrieve all fiscal keys
export async function GET() {
  try {
    const keys = await sql`
      SELECT * FROM fiscal_keys 
      ORDER BY scan_date DESC 
      LIMIT 100
    `
    return NextResponse.json({ success: true, data: keys })
  } catch (error) {
    console.error("[v0] Error fetching fiscal keys:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch fiscal keys" }, { status: 500 })
  }
}

// POST: Add a new fiscal key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { access_key, qr_code_url, scan_method, notes } = body

    // Validate access key format (44 characters)
    if (!access_key || access_key.length !== 44) {
      return NextResponse.json(
        { success: false, error: "Invalid access key format. Must be 44 characters." },
        { status: 400 },
      )
    }

    // Check for duplicates
    const existing = await sql`
      SELECT id FROM fiscal_keys WHERE access_key = ${access_key}
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "This fiscal key has already been registered.", duplicate: true },
        { status: 409 },
      )
    }

    // Insert new fiscal key
    const result = await sql`
      INSERT INTO fiscal_keys (access_key, qr_code_url, scan_method, notes)
      VALUES (${access_key}, ${qr_code_url || null}, ${scan_method}, ${notes || null})
      RETURNING *
    `

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error) {
    console.error("[v0] Error saving fiscal key:", error)
    return NextResponse.json({ success: false, error: "Failed to save fiscal key" }, { status: 500 })
  }
}
