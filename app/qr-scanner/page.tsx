import { QRScanner } from "@/components/qr-scanner"

export default function QRScannerPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Leitor de QR Code</h1>
        <p className="text-muted-foreground text-lg">
          Escaneie ou faça upload de QR codes de cupons fiscais para extrair e armazenar chaves de acesso
        </p>
      </div>

      <QRScanner />

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Como funciona</h2>
        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
          <li>Escolha escanear com webcam ou fazer upload de uma imagem do QR code</li>
          <li>O sistema extrai a chave de acesso fiscal de 44 dígitos</li>
          <li>Verifique a chave extraída ou insira manualmente se necessário</li>
          <li>Adicione observações opcionais sobre o cupom</li>
          <li>Salve a chave - duplicatas são automaticamente prevenidas</li>
        </ol>
      </div>
    </div>
  )
}
