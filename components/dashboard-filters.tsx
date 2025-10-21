"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, RefreshCw } from "lucide-react"

interface DashboardFiltersProps {
  onFilterChange: (filters: { startDate: string; endDate: string }) => void
  onExport: (type: string) => void
  onRefresh: () => void
}

export function DashboardFilters({ onFilterChange, onExport, onRefresh }: DashboardFiltersProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleApplyFilters = () => {
    onFilterChange({ startDate, endDate })
  }

  const handleClearFilters = () => {
    setStartDate("")
    setEndDate("")
    onFilterChange({ startDate: "", endDate: "" })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Data Inicial</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label>Data Final</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar
            </Button>
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onExport("receipts")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Cupons
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport("items")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Itens
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport("payments")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Pagamentos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
