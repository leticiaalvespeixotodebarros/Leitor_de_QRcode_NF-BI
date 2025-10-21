import { ReceiptForm } from "@/components/receipt-form"

export default function DataIngestionPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Ingestão de Dados</h1>
        <p className="text-muted-foreground text-lg">
          Importe e processe dados completos de cupons fiscais incluindo itens e formas de pagamento
        </p>
      </div>

      <ReceiptForm />

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Guia de Formato de Dados</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Campos Obrigatórios:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Chave de Acesso (44 dígitos) - deve existir na tabela fiscal_keys</li>
              <li>Data de Emissão</li>
              <li>Valor Total</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Formato de Importação JSON:</h3>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              {`{
  "receipt": {
    "access_key": "12345678901234567890123456789012345678901234",
    "emission_date": "2024-01-15",
    "total_amount": 150.75,
    "establishment_name": "Nome da Loja"
  },
  "items": [
    {
      "product_name": "Produto 1",
      "quantity": 2,
      "unit_price": 25.50,
      "total_price": 51.00
    }
  ],
  "payments": [
    {
      "payment_type": "Cartão de Crédito",
      "payment_amount": 150.75
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
