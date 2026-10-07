export const LOGO_MAX_BYTES = 1024 * 1024

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

export type LogoContentType = 'image/png' | 'image/jpeg' | 'image/webp'

export type LogoFileProblem = 'empty' | 'too_large' | 'unsupported'

export function detectLogoType(bytes: Uint8Array): LogoContentType | null {
  if (bytes.length >= PNG_SIGNATURE.length && PNG_SIGNATURE.every((byte, index) => bytes[index] === byte)) {
    return 'image/png'
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg'
  }

  if (bytes.length >= 12) {
    const riff = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0, bytes[2] ?? 0, bytes[3] ?? 0)
    const webp = String.fromCharCode(bytes[8] ?? 0, bytes[9] ?? 0, bytes[10] ?? 0, bytes[11] ?? 0)

    if (riff === 'RIFF' && webp === 'WEBP') {
      return 'image/webp'
    }
  }

  return null
}

export async function validateLogoFile(file: File): Promise<LogoFileProblem | null> {
  if (file.size === 0) {
    return 'empty'
  }

  if (file.size > LOGO_MAX_BYTES) {
    return 'too_large'
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())

  if (!detectLogoType(header)) {
    return 'unsupported'
  }

  return null
}
