"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Receipt, TrendingUp, Tag } from "lucide-react"

interface SummaryData {
  total_receipts: number
  total_sales: number
  average_ticket: number
  total_discounts: number
  unique_products: number
  payment_types: number
}

interface DashboardSummaryProps {
  data: SummaryData | null
  isLoading: boolean
}

export function DashboardSummary({ data, isLoading }: DashboardSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const stats = [
    {
      title: "Vendas Totais",
      value: data ? formatCurrency(data.total_sales) : "-",
      icon: DollarSign,
      description: `${data?.total_receipts || 0} cupons`,
    },
    {
      title: "Ticket Médio",
      value: data ? formatCurrency(data.average_ticket) : "-",
      icon: TrendingUp,
      description: "Por cupom",
    },
    {
      title: "Descontos Totais",
      value: data ? formatCurrency(data.total_discounts) : "-",
      icon: Tag,
      description: `${data ? ((data.total_discounts / data.total_sales) * 100).toFixed(1) : 0}% das vendas`,
    },
    {
      title: "Produtos Únicos",
      value: data?.unique_products || 0,
      icon: Receipt,
      description: `${data?.payment_types || 0} tipos de pagamento`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
