import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Presentation, BookOpen, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground text-lg">
          Complete documentation, technical reports, and presentation materials
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <BookOpen className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>README</CardTitle>
            <CardDescription>Installation guide and system overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/README.md" target="_blank">
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View README
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Technical Report</CardTitle>
            <CardDescription>Detailed architecture and implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docs/technical-report.md" target="_blank">
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Presentation className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Presentation Slides</CardTitle>
            <CardDescription>25-minute executive presentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docs/presentation-slides.md" target="_blank">
              <Button className="w-full">
                <Presentation className="h-4 w-4 mr-2" />
                View Slides
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-10 w-10 mb-2 text-primary" />
            <CardTitle>Presentation Script</CardTitle>
            <CardDescription>Speaker notes and talking points</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/docs/presentation-script.md" target="_blank">
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Script
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">System Components</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/qr-scanner" className="text-primary hover:underline">
                  QR Code Scanner
                </Link>{" "}
                - Capture fiscal receipt access keys
              </li>
              <li>
                <Link href="/data-ingestion" className="text-primary hover:underline">
                  Data Ingestion
                </Link>{" "}
                - Import complete receipt data
              </li>
              <li>
                <Link href="/dashboard" className="text-primary hover:underline">
                  BI Dashboard
                </Link>{" "}
                - Interactive analytics and visualizations
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Database Scripts</h3>
            <p className="text-sm text-muted-foreground mb-2">
              SQL scripts are located in the <code className="bg-muted px-1 py-0.5 rounded">/scripts</code> folder:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 01-create-fiscal-keys-table.sql</li>
              <li>• 02-create-fiscal-receipts-table.sql</li>
              <li>• 03-create-receipt-items-table.sql</li>
              <li>• 04-create-payment-methods-table.sql</li>
              <li>• 05-create-views-and-functions.sql</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">API Endpoints</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">GET /api/fiscal-keys</code> - List fiscal keys
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">POST /api/fiscal-keys</code> - Add fiscal key
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">GET /api/receipts</code> - List receipts
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">POST /api/receipts</code> - Create receipt
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">GET /api/analytics/summary</code> - Dashboard summary
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded">GET /api/analytics/export</code> - Export CSV
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            For questions or issues, please refer to the documentation above or contact support.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="https://vercel.com/help" target="_blank" rel="noopener noreferrer">
                Vercel Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download Project
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
