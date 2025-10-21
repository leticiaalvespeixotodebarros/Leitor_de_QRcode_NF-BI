"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface SalesChartProps {
  data: any[]
  isLoading: boolean
}

export function SalesChart({ data, isLoading }: SalesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    date: formatDate(item.period),
    sales: Number.parseFloat(item.total_sales),
    receipts: Number.parseInt(item.receipt_count),
    average: Number.parseFloat(item.average_ticket),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
        <CardDescription>Daily sales revenue and receipt count</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" tickFormatter={formatCurrency} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === "sales" || name === "average") {
                    return formatCurrency(value)
                  }
                  return value
                }}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--primary))" name="Total Sales" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="receipts"
                stroke="hsl(var(--chart-2))"
                name="Receipt Count"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
