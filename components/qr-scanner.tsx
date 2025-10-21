"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { extractAccessKeyFromQRCode, validateAccessKey, formatAccessKey } from "@/lib/qr-utils"

export function QRScanner() {
  const [scanMethod, setScanMethod] = useState<"webcam" | "upload" | null>(null)
  const [qrData, setQrData] = useState("")
  const [accessKey, setAccessKey] = useState("")
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error" | "duplicate">("idle")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setScanMethod("webcam")
      setStatus("scanning")
      setMessage("Posicione o QR code na frente da câmera")
    } catch (error) {
      console.error("[v0] Erro ao acessar webcam:", error)
      setStatus("error")
      setMessage("Não foi possível acessar a webcam. Verifique as permissões.")
    }
  }

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanMethod(null)
    setStatus("idle")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setScanMethod("upload")
    setStatus("scanning")
    setMessage("Processando imagem do QR code...")

    // In a real implementation, you would use a QR code library like jsQR
    // For this demo, we'll simulate the process
    setTimeout(() => {
      // Simulated QR code data - in production, use a proper QR scanner library
      const simulatedQRData =
        "http://www.fazenda.sp.gov.br/nfce/qrcode?p=12345678901234567890123456789012345678901234|2|1|1|HASH"
      processQRData(simulatedQRData)
    }, 1000)
  }

  const processQRData = (data: string) => {
    setQrData(data)
    const key = extractAccessKeyFromQRCode(data)

    if (key && validateAccessKey(key)) {
      setAccessKey(key)
      setStatus("idle")
      setMessage(`Chave de acesso extraída: ${formatAccessKey(key)}`)
    } else {
      setStatus("error")
      setMessage("Não foi possível extrair uma chave de acesso válida do QR code")
    }
  }

  const handleManualInput = (value: string) => {
    // Remove spaces and non-digits
    const cleaned = value.replace(/\D/g, "")
    setAccessKey(cleaned)

    if (cleaned.length === 44) {
      if (validateAccessKey(cleaned)) {
        setMessage(`Chave de acesso válida: ${formatAccessKey(cleaned)}`)
        setStatus("idle")
      } else {
        setMessage("Formato de chave de acesso inválido")
        setStatus("error")
      }
    }
  }

  const handleSubmit = async () => {
    if (!accessKey || !validateAccessKey(accessKey)) {
      setStatus("error")
      setMessage("Por favor, forneça uma chave de acesso válida de 44 dígitos")
      return
    }

    setIsSubmitting(true)
    setStatus("scanning")
    setMessage("Salvando chave fiscal...")

    try {
      const response = await fetch("/api/fiscal-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          qr_code_url: qrData || null,
          scan_method: scanMethod || "manual",
          notes: notes || null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus("success")
        setMessage("Chave fiscal salva com sucesso!")
        // Reset form after 2 seconds
        setTimeout(() => {
          setAccessKey("")
          setQrData("")
          setNotes("")
          setStatus("idle")
          setMessage("")
          stopWebcam()
        }, 2000)
      } else if (result.duplicate) {
        setStatus("duplicate")
        setMessage("Esta chave fiscal já foi registrada anteriormente")
      } else {
        setStatus("error")
        setMessage(result.error || "Falha ao salvar chave fiscal")
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar chave fiscal:", error)
      setStatus("error")
      setMessage("Erro de rede. Por favor, tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setAccessKey("")
    setQrData("")
    setNotes("")
    setStatus("idle")
    setMessage("")
    stopWebcam()
  }

  return (
    <div className="space-y-6">
      {/* Scan Method Selection */}
      {!scanMethod && status !== "success" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={startWebcam}>
            <CardHeader>
              <Camera className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Escanear com Webcam</CardTitle>
              <CardDescription>Use a câmera do seu dispositivo para escanear QR codes</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardHeader>
              <Upload className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Fazer Upload de Imagem</CardTitle>
              <CardDescription>Envie uma foto do QR code</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Webcam View */}
      {scanMethod === "webcam" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scanner de Webcam</CardTitle>
              <Button variant="ghost" size="icon" onClick={stopWebcam}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-muted" />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Nota: Em produção, integre uma biblioteca de leitura de QR como jsQR ou html5-qrcode
            </p>
          </CardContent>
        </Card>
      )}

      {/* Manual Input / Extracted Key */}
      <Card>
        <CardHeader>
          <CardTitle>Chave de Acesso Fiscal</CardTitle>
          <CardDescription>Insira ou verifique a chave de acesso do cupom fiscal de 44 dígitos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Chave de Acesso</label>
            <input
              type="text"
              value={formatAccessKey(accessKey)}
              onChange={(e) => handleManualInput(e.target.value)}
              placeholder="Insira a chave de acesso de 44 dígitos"
              className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              maxLength={54} // 44 digits + 10 spaces
            />
            <p className="text-xs text-muted-foreground mt-1">{accessKey.length}/44 dígitos</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Observações (Opcional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre este cupom..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!accessKey || accessKey.length !== 44 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Salvando..." : "Salvar Chave Fiscal"}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert variant={status === "error" || status === "duplicate" ? "destructive" : "default"}>
          {status === "success" && <CheckCircle2 className="h-4 w-4" />}
          {(status === "error" || status === "duplicate") && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
