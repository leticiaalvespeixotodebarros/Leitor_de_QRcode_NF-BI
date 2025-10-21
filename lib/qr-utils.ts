// Utility functions for QR code processing
export function extractAccessKeyFromQRCode(qrData: string): string | null {
  try {
    // Brazilian NFC-e QR codes typically contain the access key in the URL
    // Format: http://www.fazenda.sp.gov.br/nfce/qrcode?p=ACCESSKEY|2|1|1|HASH
    // Or the access key might be directly in the data

    // Try to extract from URL parameter
    const urlMatch = qrData.match(/[?&]p=([0-9]{44})/i)
    if (urlMatch) {
      return urlMatch[1]
    }

    // Try to find 44-digit sequence
    const directMatch = qrData.match(/\b([0-9]{44})\b/)
    if (directMatch) {
      return directMatch[1]
    }

    // Try to extract from pipe-separated format
    const pipeMatch = qrData.split("|")[0]
    if (pipeMatch && /^[0-9]{44}$/.test(pipeMatch)) {
      return pipeMatch
    }

    return null
  } catch (error) {
    console.error("[v0] Error extracting access key:", error)
    return null
  }
}

export function validateAccessKey(key: string): boolean {
  // Brazilian fiscal access key is exactly 44 digits
  return /^[0-9]{44}$/.test(key)
}

export function formatAccessKey(key: string): string {
  // Format: XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX
  return key.match(/.{1,4}/g)?.join(" ") || key
}
