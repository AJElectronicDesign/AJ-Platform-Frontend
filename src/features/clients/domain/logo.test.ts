import { describe, expect, it } from 'vitest'
import { LOGO_MAX_BYTES, validateLogoFile } from '@/features/clients/domain/logo'

function fileFrom(bytes: Uint8Array, name: string, type: string): File {
  const copy = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(copy).set(bytes)
  return new File([copy], name, { type })
}

describe('validateLogoFile', () => {
  it('accepts PNG, JPEG, and WebP signatures up to 1 MB', async () => {
    const png = fileFrom(
      Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]),
      'logo.png',
      'application/octet-stream',
    )
    const jpeg = fileFrom(Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]), 'logo.jpg', 'image/jpeg')
    const webp = fileFrom(
      Uint8Array.from([
        ...'RIFF'.split('').map((char) => char.charCodeAt(0)),
        0,
        0,
        0,
        0,
        ...'WEBP'.split('').map((char) => char.charCodeAt(0)),
      ]),
      'logo.webp',
      'image/webp',
    )

    await expect(validateLogoFile(png)).resolves.toBeNull()
    await expect(validateLogoFile(jpeg)).resolves.toBeNull()
    await expect(validateLogoFile(webp)).resolves.toBeNull()
  })

  it('rejects an empty file, a file over 1 MB, and a non-image before upload', async () => {
    await expect(validateLogoFile(new File([], 'empty.png', { type: 'image/png' }))).resolves.toBe(
      'empty',
    )

    const huge = new Uint8Array(LOGO_MAX_BYTES + 1)
    huge.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

    await expect(validateLogoFile(fileFrom(huge, 'big.png', 'image/png'))).resolves.toBe('too_large')
    await expect(
      validateLogoFile(fileFrom(Uint8Array.from([...'<svg></svg>'.split('').map((char) => char.charCodeAt(0))]), 'logo.svg', 'image/svg+xml')),
    ).resolves.toBe('unsupported')
  })
})
