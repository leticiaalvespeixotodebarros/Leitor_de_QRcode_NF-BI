"use client"

import { useState, useEffect } from "react"
import { DashboardFilters } from "@/components/dashboard-filters"
import { DashboardSummary } from "@/components/dashboard-summary"
import { SalesChart } from "@/components/sales-chart"
import { TopProductsChart } from "@/components/top-products-chart"
import { PaymentMethodsChart } from "@/components/payment-methods-chart"

export default function DashboardPage() {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" })
  const [summaryData, setSummaryData] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [productsData, setProductsData] = useState([])
  const [paymentsData, setPaymentsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append("start_date", filters.startDate)
      if (filters.endDate) params.append("end_date", filters.endDate)

      const [summaryRes, salesRes, productsRes, paymentsRes] = await Promise.all([
        fetch(`/api/analytics/summary?${params}`),
        fetch(`/api/analytics/sales-over-time?${params}`),
        fetch(`/api/analytics/top-products?${params}&limit=10`),
        fetch(`/api/analytics/payment-methods?${params}`),
      ])

      const [summary, sales, products, payments] = await Promise.all([
        summaryRes.json(),
        salesRes.json(),
        productsRes.json(),
        paymentsRes.json(),
      ])

      if (summary.success) setSummaryData(summary.data)
      if (sales.success) setSalesData(sales.data)
      if (products.success) setProductsData(products.data)
      if (payments.success) setPaymentsData(payments.data)
    } catch (error) {
      console.error("[v0] Erro ao buscar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filters])

  const handleExport = (type: string) => {
    const params = new URLSearchParams({ type })
    if (filters.startDate) params.append("start_date", filters.startDate)
    if (filters.endDate) params.append("end_date", filters.endDate)

    window.open(`/api/analytics/export?${params}`, "_blank")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard de Business Intelligence</h1>
        <p className="text-muted-foreground text-lg">
          Analise seus dados de cupons fiscais com visualizações interativas
        </p>
      </div>

      <div className="space-y-6">
        <DashboardFilters onFilterChange={setFilters} onExport={handleExport} onRefresh={fetchData} />

        <DashboardSummary data={summaryData} isLoading={isLoading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} isLoading={isLoading} />
          </div>

          <TopProductsChart data={productsData} isLoading={isLoading} />

          <PaymentMethodsChart data={paymentsData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
