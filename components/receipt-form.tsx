"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { parseJSONReceipt, generateSampleReceipt } from "@/lib/receipt-parser"
import type { ParsedReceipt } from "@/lib/receipt-parser"

export function ReceiptForm() {
  const [receipt, setReceipt] = useState<ParsedReceipt["receipt"]>({
    access_key: "",
    emission_date: new Date().toISOString().split("T")[0],
    total_amount: 0,
  })
  const [items, setItems] = useState<ParsedReceipt["items"]>([])
  const [payments, setPayments] = useState<ParsedReceipt["payments"]>([])
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImportJSON = (jsonText: string) => {
    const parsed = parseJSONReceipt(jsonText)
    if (parsed) {
      setReceipt(parsed.receipt)
      setItems(parsed.items)
      setPayments(parsed.payments)
      setStatus("idle")
      setMessage("Dados importados com sucesso")
    } else {
      setStatus("error")
      setMessage("Falha ao analisar dados JSON")
    }
  }

  const handleLoadSample = () => {
    const sample = generateSampleReceipt(receipt.access_key || "12345678901234567890123456789012345678901234")
    setReceipt(sample.receipt)
    setItems(sample.items)
    setPayments(sample.payments)
    setMessage("Dados de exemplo carregados")
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        item_number: items.length + 1,
        product_name: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Auto-calculate total price
    if (field === "quantity" || field === "unit_price") {
      const quantity = field === "quantity" ? Number.parseFloat(value) : newItems[index].quantity
      const unitPrice = field === "unit_price" ? Number.parseFloat(value) : newItems[index].unit_price
      newItems[index].total_price = quantity * unitPrice
    }

    setItems(newItems)
  }

  const addPayment = () => {
    setPayments([
      ...payments,
      {
        payment_type: "Dinheiro",
        payment_amount: 0,
        installments: 1,
      },
    ])
  }

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index))
  }

  const updatePayment = (index: number, field: string, value: any) => {
    const newPayments = [...payments]
    newPayments[index] = { ...newPayments[index], [field]: value }
    setPayments(newPayments)
  }

  const handleSubmit = async () => {
    if (!receipt.access_key || receipt.access_key.length !== 44) {
      setStatus("error")
      setMessage("Por favor, forneça uma chave de acesso válida de 44 dígitos")
      return
    }

    if (!receipt.emission_date || receipt.total_amount <= 0) {
      setStatus("error")
      setMessage("Por favor, preencha a data de emissão e o valor total")
      return
    }

    setIsSubmitting(true)
    setStatus("idle")
    setMessage("Salvando dados do cupom...")

    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt, items, payments }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus("success")
        setMessage("Cupom salvo com sucesso!")
        // Reset form after 2 seconds
        setTimeout(() => {
          setReceipt({
            access_key: "",
            emission_date: new Date().toISOString().split("T")[0],
            total_amount: 0,
          })
          setItems([])
          setPayments([])
          setStatus("idle")
          setMessage("")
        }, 2000)
      } else {
        setStatus("error")
        setMessage(result.error || "Falha ao salvar cupom")
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar cupom:", error)
      setStatus("error")
      setMessage("Erro de rede. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Importe dados ou carregue um cupom de exemplo</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" onClick={handleLoadSample}>
            Carregar Dados de Exemplo
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const json = prompt("Cole os dados JSON:")
              if (json) handleImportJSON(json)
            }}
          >
            Importar JSON
          </Button>
        </CardContent>
      </Card>

      {/* Informações do Cupom */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cupom</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Chave de Acesso *</Label>
              <Input
                value={receipt.access_key}
                onChange={(e) => setReceipt({ ...receipt, access_key: e.target.value.replace(/\D/g, "") })}
                placeholder="Chave de acesso de 44 dígitos"
                maxLength={44}
                className="font-mono"
              />
            </div>
            <div>
              <Label>Data de Emissão *</Label>
              <Input
                type="date"
                value={receipt.emission_date}
                onChange={(e) => setReceipt({ ...receipt, emission_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Número do Cupom</Label>
              <Input
                value={receipt.receipt_number || ""}
                onChange={(e) => setReceipt({ ...receipt, receipt_number: e.target.value })}
              />
            </div>
            <div>
              <Label>Série</Label>
              <Input
                value={receipt.series || ""}
                onChange={(e) => setReceipt({ ...receipt, series: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Nome do Estabelecimento</Label>
            <Input
              value={receipt.establishment_name || ""}
              onChange={(e) => setReceipt({ ...receipt, establishment_name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>CNPJ</Label>
              <Input
                value={receipt.establishment_cnpj || ""}
                onChange={(e) => setReceipt({ ...receipt, establishment_cnpj: e.target.value })}
              />
            </div>
            <div>
              <Label>Valor Total *</Label>
              <Input
                type="number"
                step="0.01"
                value={receipt.total_amount}
                onChange={(e) => setReceipt({ ...receipt, total_amount: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Itens</CardTitle>
              <CardDescription>Adicione produtos do cupom</CardDescription>
            </div>
            <Button onClick={addItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Item {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Label>Nome do Produto *</Label>
                  <Input
                    value={item.product_name}
                    onChange={(e) => updateItem(index, "product_name", e.target.value)}
                    placeholder="Nome do produto"
                  />
                </div>
                <div>
                  <Label>Código do Produto</Label>
                  <Input
                    value={item.product_code || ""}
                    onChange={(e) => updateItem(index, "product_code", e.target.value)}
                    placeholder="EAN/SKU"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <Label>Quantidade *</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Preço Unitário *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Preço Total</Label>
                  <Input type="number" step="0.01" value={item.total_price.toFixed(2)} disabled />
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum item adicionado ainda</p>
          )}
        </CardContent>
      </Card>

      {/* Formas de Pagamento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Formas de Pagamento</CardTitle>
              <CardDescription>Adicione informações de pagamento</CardDescription>
            </div>
            <Button onClick={addPayment} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pagamento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.map((payment, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Pagamento {index + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removePayment(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <Label>Tipo de Pagamento *</Label>
                  <select
                    value={payment.payment_type}
                    onChange={(e) => updatePayment(index, "payment_type", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>Dinheiro</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>PIX</option>
                    <option>Boleto</option>
                  </select>
                </div>
                <div>
                  <Label>Valor *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={payment.payment_amount}
                    onChange={(e) => updatePayment(index, "payment_amount", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Parcelas</Label>
                  <Input
                    type="number"
                    value={payment.installments}
                    onChange={(e) => updatePayment(index, "installments", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma forma de pagamento adicionada ainda
            </p>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Salvando..." : "Salvar Cupom"}
        </Button>
      </div>

      {/* Status Messages */}
      {message && (
        <Alert variant={status === "error" ? "destructive" : "default"}>
          {status === "success" && <CheckCircle2 className="h-4 w-4" />}
          {status === "error" && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
