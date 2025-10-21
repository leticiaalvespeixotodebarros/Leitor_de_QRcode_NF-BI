import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, BarChart3, Database, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-balance">Sistema BI de Cupons Fiscais</h1>
        <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
          Solução completa para leitura de cupons fiscais brasileiros e análise de dados de vendas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card>
          <CardHeader>
            <QrCode className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Leitor QR Code</CardTitle>
            <CardDescription>Escaneie QR codes de cupons fiscais com webcam ou upload</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/qr-scanner">
              <Button className="w-full">Abrir Leitor</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Database className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Ingestão de Dados</CardTitle>
            <CardDescription>Importe e processe dados de cupons fiscais</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/data-ingestion">
              <Button className="w-full">Gerenciar Dados</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Dashboard BI</CardTitle>
            <CardDescription>Analise vendas com gráficos interativos</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Ver Análises</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Documentação</CardTitle>
            <CardDescription>Documentação técnica e guias de uso</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docs">
              <Button className="w-full bg-transparent" variant="outline">
                Ler Docs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Funcionalidades do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Fase 1: Leitor de QR Code</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Suporte a webcam e upload de imagem</li>
                <li>• Extração automática da chave de acesso</li>
                <li>• Prevenção de duplicatas</li>
                <li>• Armazenamento em PostgreSQL</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fase 2: Business Intelligence</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Análise de séries temporais de vendas</li>
                <li>• Ranking de produtos mais vendidos</li>
                <li>• Comparação de formas de pagamento</li>
                <li>• Filtros interativos e exportação CSV</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
