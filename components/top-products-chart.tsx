"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopProductsChartProps {
  data: any[]
  isLoading: boolean
}

export function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const chartData = data.map((item) => ({
    name: item.product_name.length > 20 ? item.product_name.substring(0, 20) + "..." : item.product_name,
    revenue: Number.parseFloat(item.total_revenue),
    quantity: Number.parseFloat(item.total_quantity),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products by Revenue</CardTitle>
        <CardDescription>Best-selling products ranked by total revenue</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                formatter={(value: any) => formatCurrency(value)}
                labelStyle={{ color: "#000" }}
                contentStyle={{ fontSize: "12px" }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
