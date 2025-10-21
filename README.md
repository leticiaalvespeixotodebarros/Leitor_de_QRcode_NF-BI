# Sistema de Business Intelligence para Cupons Fiscais

Sistema completo para leitura de QR codes de cupons fiscais brasileiros (NFC-e) e análise de dados de vendas com dashboard interativo.

## Visão Geral

Este projeto implementa uma solução full-stack para:

1. **Fase 1 - Leitor de QR Code**: Captura e armazena chaves de acesso de cupons fiscais via webcam ou upload de imagem
2. **Fase 2 - Dashboard BI**: Análise interativa de dados de vendas com visualizações, filtros e exportação CSV

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Banco de Dados**: PostgreSQL (Neon)
- **Visualizações**: Recharts
- **UI Components**: shadcn/ui
- **QR Code**: Suporte para webcam e upload de imagens

## Estrutura do Banco de Dados

### Tabelas Principais

1. **fiscal_keys** - Armazena chaves de acesso dos cupons fiscais
2. **fiscal_receipts** - Dados completos dos cupons fiscais
3. **receipt_items** - Itens individuais de cada cupom
4. **payment_methods** - Métodos de pagamento utilizados

### Views e Funções

- `daily_sales_summary` - Resumo diário de vendas
- `top_products_by_revenue` - Produtos mais vendidos
- `payment_method_distribution` - Distribuição de métodos de pagamento
- `get_sales_by_date_range()` - Função para consultas por período

## Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta Vercel (para deploy)
- Banco de dados PostgreSQL (Neon recomendado)

### Passo a Passo

1. **Clone ou baixe o projeto**
   \`\`\`bash
   # Via GitHub (se disponível)
   git clone <repository-url>
   cd fiscal-bi-project

   # Ou baixe o ZIP e extraia
   \`\`\`

2. **Instale as dependências**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure o banco de dados**
   
   As variáveis de ambiente já estão configuradas no projeto Vercel:
   - `NEON_NEON_DATABASE_URL` - URL de conexão com PostgreSQL
   
   Execute os scripts SQL na ordem:
   \`\`\`bash
   # Os scripts estão em /scripts
   # Execute-os diretamente no v0 ou via cliente PostgreSQL
   01-create-fiscal-keys-table.sql
   02-create-fiscal-receipts-table.sql
   03-create-receipt-items-table.sql
   04-create-payment-methods-table.sql
   05-create-views-and-functions.sql
   \`\`\`

4. **Execute o projeto localmente**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   Acesse: http://localhost:3000

5. **Deploy para produção**
   \`\`\`bash
   # Via Vercel CLI
   vercel deploy --prod
   
   # Ou use o botão "Publish" no v0
   \`\`\`

## Uso do Sistema

### 1. Leitor de QR Code

**Acesse**: `/qr-scanner`

**Funcionalidades**:
- Escanear QR code via webcam
- Upload de imagem do QR code
- Entrada manual da chave de acesso (44 dígitos)
- Prevenção automática de duplicatas
- Adição de notas/observações

**Fluxo de uso**:
1. Escolha o método de captura (webcam ou upload)
2. O sistema extrai automaticamente a chave de acesso
3. Verifique a chave extraída (ou insira manualmente)
4. Adicione notas opcionais
5. Salve no banco de dados

### 2. Ingestão de Dados

**Acesse**: `/data-ingestion`

**Funcionalidades**:
- Formulário completo para entrada de dados do cupom
- Importação via JSON
- Carregamento de dados de exemplo
- Adição de múltiplos itens e pagamentos
- Cálculo automático de totais

**Campos obrigatórios**:
- Chave de acesso (44 dígitos) - deve existir na tabela fiscal_keys
- Data de emissão
- Valor total

**Formato JSON para importação**:
\`\`\`json
{
  "receipt": {
    "access_key": "12345678901234567890123456789012345678901234",
    "emission_date": "2024-01-15",
    "total_amount": 150.75,
    "establishment_name": "Supermercado Exemplo"
  },
  "items": [
    {
      "product_name": "Arroz 5kg",
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
}
\`\`\`

### 3. Dashboard BI

**Acesse**: `/dashboard`

**Visualizações disponíveis**:

1. **Resumo Executivo**
   - Total de vendas
   - Ticket médio
   - Total de descontos
   - Produtos únicos

2. **Vendas ao Longo do Tempo**
   - Gráfico de linha com série temporal
   - Total de vendas e quantidade de cupons
   - Visualização por dia/semana/mês

3. **Top Produtos**
   - Gráfico de barras horizontal
   - Produtos ranqueados por receita total
   - Quantidade vendida e preço médio

4. **Métodos de Pagamento**
   - Gráfico de pizza
   - Distribuição percentual
   - Valor total e quantidade de transações

**Filtros**:
- Data inicial e final
- Aplicar/limpar filtros
- Atualizar dados

**Exportação**:
- Exportar cupons para CSV
- Exportar itens para CSV
- Exportar pagamentos para CSV
- Respeita filtros de data aplicados

## Estrutura de Arquivos

\`\`\`
fiscal-bi-project/
├── app/
│   ├── api/
│   │   ├── fiscal-keys/route.ts       # API para chaves fiscais
│   │   ├── receipts/route.ts          # API para cupons
│   │   └── analytics/                 # APIs de análise
│   │       ├── sales-over-time/
│   │       ├── top-products/
│   │       ├── payment-methods/
│   │       ├── summary/
│   │       └── export/
│   ├── qr-scanner/page.tsx            # Página do leitor QR
│   ├── data-ingestion/page.tsx        # Página de ingestão
│   ├── dashboard/page.tsx             # Dashboard BI
│   └── page.tsx                       # Página inicial
├── components/
│   ├── qr-scanner.tsx                 # Componente de scanner
│   ├── receipt-form.tsx               # Formulário de cupom
│   ├── dashboard-filters.tsx          # Filtros do dashboard
│   ├── dashboard-summary.tsx          # Resumo executivo
│   ├── sales-chart.tsx                # Gráfico de vendas
│   ├── top-products-chart.tsx         # Gráfico de produtos
│   └── payment-methods-chart.tsx      # Gráfico de pagamentos
├── lib/
│   ├── db.ts                          # Conexão com banco
│   ├── qr-utils.ts                    # Utilitários QR
│   └── receipt-parser.ts              # Parser de cupons
├── scripts/
│   ├── 01-create-fiscal-keys-table.sql
│   ├── 02-create-fiscal-receipts-table.sql
│   ├── 03-create-receipt-items-table.sql
│   ├── 04-create-payment-methods-table.sql
│   └── 05-create-views-and-functions.sql
└── docs/
    ├── technical-report.md            # Relatório técnico
    ├── presentation-slides.md         # Slides da apresentação
    └── presentation-script.md         # Roteiro de apresentação
\`\`\`

## API Endpoints

### Fiscal Keys
- `GET /api/fiscal-keys` - Lista todas as chaves
- `POST /api/fiscal-keys` - Adiciona nova chave

### Receipts
- `GET /api/receipts` - Lista cupons (com paginação)
- `POST /api/receipts` - Cria novo cupom
- `GET /api/receipts/[id]` - Detalhes de um cupom
- `DELETE /api/receipts/[id]` - Remove cupom

### Analytics
- `GET /api/analytics/summary` - Resumo executivo
- `GET /api/analytics/sales-over-time` - Série temporal de vendas
- `GET /api/analytics/top-products` - Produtos mais vendidos
- `GET /api/analytics/payment-methods` - Distribuição de pagamentos
- `GET /api/analytics/export` - Exportação CSV

## Segurança e Boas Práticas

- ✅ Validação de dados no backend
- ✅ Prevenção de duplicatas
- ✅ Sanitização de inputs
- ✅ Tratamento de erros
- ✅ Logs para debugging
- ✅ Índices no banco para performance
- ✅ Transações para integridade de dados

## Troubleshooting

### Erro: "Access key not found"
- Certifique-se de escanear o QR code primeiro em `/qr-scanner`
- A chave de acesso deve existir na tabela `fiscal_keys` antes de criar o cupom

### Erro: "Duplicate key"
- O sistema previne duplicatas automaticamente
- Verifique se o cupom já foi registrado

### Gráficos não aparecem
- Verifique se há dados no banco
- Use "Load Sample Data" para testar
- Verifique os filtros de data

### Webcam não funciona
- Verifique permissões do navegador
- Use upload de imagem como alternativa
- Em produção, integre biblioteca de QR scanning (jsQR, html5-qrcode)

## Próximos Passos

### Melhorias Sugeridas

1. **QR Code Scanner**
   - Integrar biblioteca jsQR ou html5-qrcode para scanning real
   - Adicionar suporte para múltiplos QR codes em batch
   - Implementar histórico de scans

2. **Dashboard**
   - Adicionar mais visualizações (heatmaps, treemaps)
   - Implementar comparação de períodos
   - Adicionar alertas e notificações
   - Dashboard em tempo real com WebSockets

3. **Relatórios**
   - Geração de PDF com gráficos
   - Relatórios agendados por email
   - Exportação para Excel com formatação

4. **Autenticação**
   - Sistema de login/registro
   - Controle de acesso por perfil
   - Auditoria de ações

5. **Mobile**
   - App mobile nativo (React Native)
   - PWA para uso offline
   - Notificações push

## Suporte

Para dúvidas ou problemas:
1. Consulte a documentação técnica em `/docs/technical-report.md`
2. Verifique os logs do console (mensagens com `[v0]`)
3. Abra um ticket de suporte no Vercel

## Licença

Este projeto foi desenvolvido como parte de um sistema de Business Intelligence para análise de cupons fiscais brasileiros.

---

**Desenvolvido com Next.js, React, TypeScript e PostgreSQL**
