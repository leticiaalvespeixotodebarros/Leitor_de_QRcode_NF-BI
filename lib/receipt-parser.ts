// Utility functions for parsing fiscal receipt data
export interface ParsedReceipt {
  receipt: {
    access_key: string
    receipt_number?: string
    series?: string
    emission_date: string
    establishment_name?: string
    establishment_cnpj?: string
    establishment_address?: string
    total_amount: number
    discount_amount?: number
    tax_amount?: number
  }
  items: Array<{
    item_number: number
    product_code?: string
    product_name: string
    product_description?: string
    quantity: number
    unit_price: number
    total_price: number
    unit_of_measure?: string
    ncm_code?: string
    cfop_code?: string
    tax_rate?: number
  }>
  payments: Array<{
    payment_type: string
    payment_amount: number
    installments?: number
    card_flag?: string
  }>
}

export function parseCSVReceipt(csvData: string): ParsedReceipt | null {
  try {
    const lines = csvData.trim().split("\n")
    if (lines.length < 2) return null

    // Simple CSV parser - in production, use a proper CSV library
    const headers = lines[0].split(",").map((h) => h.trim())
    const values = lines[1].split(",").map((v) => v.trim())

    const data: Record<string, string> = {}
    headers.forEach((header, index) => {
      data[header] = values[index] || ""
    })

    return {
      receipt: {
        access_key: data.access_key || data.chave_acesso || "",
        receipt_number: data.receipt_number || data.numero_nota,
        series: data.series || data.serie,
        emission_date: data.emission_date || data.data_emissao || new Date().toISOString(),
        establishment_name: data.establishment_name || data.nome_estabelecimento,
        establishment_cnpj: data.establishment_cnpj || data.cnpj,
        establishment_address: data.establishment_address || data.endereco,
        total_amount: Number.parseFloat(data.total_amount || data.valor_total || "0"),
        discount_amount: Number.parseFloat(data.discount_amount || data.desconto || "0"),
        tax_amount: Number.parseFloat(data.tax_amount || data.impostos || "0"),
      },
      items: [],
      payments: [],
    }
  } catch (error) {
    console.error("[v0] Error parsing CSV:", error)
    return null
  }
}

export function parseJSONReceipt(jsonData: string): ParsedReceipt | null {
  try {
    const data = JSON.parse(jsonData)

    // Handle different JSON structures
    const receipt = data.receipt || data.nota || data
    const items = data.items || data.itens || []
    const payments = data.payments || data.pagamentos || []

    return {
      receipt: {
        access_key: receipt.access_key || receipt.chave_acesso || "",
        receipt_number: receipt.receipt_number || receipt.numero,
        series: receipt.series || receipt.serie,
        emission_date: receipt.emission_date || receipt.data_emissao || new Date().toISOString(),
        establishment_name: receipt.establishment_name || receipt.estabelecimento,
        establishment_cnpj: receipt.establishment_cnpj || receipt.cnpj,
        establishment_address: receipt.establishment_address || receipt.endereco,
        total_amount: Number.parseFloat(receipt.total_amount || receipt.valor_total || "0"),
        discount_amount: Number.parseFloat(receipt.discount_amount || receipt.desconto || "0"),
        tax_amount: Number.parseFloat(receipt.tax_amount || receipt.impostos || "0"),
      },
      items: items.map((item: any, index: number) => ({
        item_number: item.item_number || item.numero || index + 1,
        product_code: item.product_code || item.codigo,
        product_name: item.product_name || item.nome || item.descricao,
        product_description: item.product_description || item.descricao_completa,
        quantity: Number.parseFloat(item.quantity || item.quantidade || "1"),
        unit_price: Number.parseFloat(item.unit_price || item.preco_unitario || "0"),
        total_price: Number.parseFloat(item.total_price || item.preco_total || "0"),
        unit_of_measure: item.unit_of_measure || item.unidade,
        ncm_code: item.ncm_code || item.ncm,
        cfop_code: item.cfop_code || item.cfop,
        tax_rate: item.tax_rate ? Number.parseFloat(item.tax_rate) : undefined,
      })),
      payments: payments.map((payment: any) => ({
        payment_type: payment.payment_type || payment.tipo || payment.forma_pagamento,
        payment_amount: Number.parseFloat(payment.payment_amount || payment.valor || "0"),
        installments: Number.parseInt(payment.installments || payment.parcelas || "1"),
        card_flag: payment.card_flag || payment.bandeira,
      })),
    }
  } catch (error) {
    console.error("[v0] Error parsing JSON:", error)
    return null
  }
}

export function generateSampleReceipt(accessKey: string): ParsedReceipt {
  return {
    receipt: {
      access_key: accessKey,
      receipt_number: "000123",
      series: "1",
      emission_date: new Date().toISOString(),
      establishment_name: "Supermercado Exemplo LTDA",
      establishment_cnpj: "12.345.678/0001-90",
      establishment_address: "Rua Exemplo, 123 - São Paulo, SP",
      total_amount: 150.75,
      discount_amount: 5.0,
      tax_amount: 12.5,
    },
    items: [
      {
        item_number: 1,
        product_code: "7891234567890",
        product_name: "Arroz Branco 5kg",
        quantity: 2,
        unit_price: 25.9,
        total_price: 51.8,
        unit_of_measure: "UN",
      },
      {
        item_number: 2,
        product_code: "7891234567891",
        product_name: "Feijão Preto 1kg",
        quantity: 3,
        unit_price: 8.5,
        total_price: 25.5,
        unit_of_measure: "UN",
      },
      {
        item_number: 3,
        product_code: "7891234567892",
        product_name: "Óleo de Soja 900ml",
        quantity: 1,
        unit_price: 7.99,
        total_price: 7.99,
        unit_of_measure: "UN",
      },
    ],
    payments: [
      {
        payment_type: "Cartão de Crédito",
        payment_amount: 150.75,
        installments: 1,
        card_flag: "Visa",
      },
    ],
  }
}
