// Database utility for connecting to Neon PostgreSQL
import { neon } from "@neondatabase/serverless"

if (!process.env.NEON_NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.NEON_DATABASE_URL)

// Type definitions for our database tables
export interface FiscalKey {
  id: number
  access_key: string
  qr_code_url: string | null
  scan_date: Date
  scan_method: "webcam" | "upload"
  notes: string | null
  created_at: Date
}

export interface FiscalReceipt {
  id: number
  access_key: string
  receipt_number: string | null
  series: string | null
  emission_date: Date
  establishment_name: string | null
  establishment_cnpj: string | null
  establishment_address: string | null
  total_amount: number
  discount_amount: number
  tax_amount: number
  receipt_status: string
  xml_data: string | null
  created_at: Date
  updated_at: Date
}

export interface ReceiptItem {
  id: number
  receipt_id: number
  item_number: number
  product_code: string | null
  product_name: string
  product_description: string | null
  quantity: number
  unit_price: number
  total_price: number
  unit_of_measure: string | null
  ncm_code: string | null
  cfop_code: string | null
  tax_rate: number | null
  created_at: Date
}

export interface PaymentMethod {
  id: number
  receipt_id: number
  payment_type: string
  payment_amount: number
  installments: number
  card_flag: string | null
  payment_date: Date
  created_at: Date
}
