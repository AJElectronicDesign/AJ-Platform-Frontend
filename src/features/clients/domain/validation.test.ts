import { describe, expect, it } from 'vitest'
import type { Client, ClientFormInput, SatCatalog } from '@/features/clients/domain/client'
import { emptyClientForm } from '@/features/clients/domain/client'
import { parseClientForm, parseClientPatch, parseContactForm } from '@/features/clients/domain/validation'

const catalog: SatCatalog = {
  taxRegimes: [
    { code: '601', description: 'General de Ley Personas Morales', appliesTo: 'moral' },
    { code: '612', description: 'Personas Físicas con Actividades Empresariales', appliesTo: 'fisica' },
    { code: '626', description: 'Régimen Simplificado de Confianza', appliesTo: 'both' },
  ],
  cfdiUses: [
    { code: 'G03', description: 'Gastos en general', appliesTo: 'both' },
    { code: 'CN01', description: 'Nómina', appliesTo: 'fisica' },
  ],
}

function form(overrides: Partial<ClientFormInput> = {}): ClientFormInput {
  return {
    ...emptyClientForm(),
    rfc: 'ABC0102031A2',
    legalName: 'Acme Industrial SA de CV',
    taxRegime: '601',
    fiscalPostalCode: '45050',
    cfdiUse: 'G03',
    quotePrefix: 'ACME',
    ...overrides,
  }
}

function issueKeys(input: ClientFormInput): string[] {
  const parsed = parseClientForm(input, catalog)

  if (parsed.ok) {
    return []
  }

  return parsed.issues.map((issue) => `${issue.path}:${issue.key}`)
}

const original: Client = {
  id: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
  rfc: 'ABC0102031A2',
  legalName: 'Acme Industrial SA de CV',
  taxRegime: '601',
  fiscalPostalCode: '45050',
  cfdiUse: 'G03',
  tradeName: 'Acme',
  email: 'compras@acme.example',
  phoneCountryCode: '+52',
  phone: '3333333333',
  currency: 'MXN',
  paymentTermsDays: 30,
  quotePrefix: 'ACME',
  notes: null,
  address: {
    street: 'Av. Ejemplo',
    exteriorNumber: '100',
    interiorNumber: null,
    colonia: 'Centro',
    city: 'Zapopan',
    state: 'Jalisco',
    country: 'MX',
    postalCode: '45050',
  },
  hasLogo: false,
  isActive: true,
  createdByUserId: null,
  updatedByUserId: null,
  createdAt: '2026-10-06T22:00:00.000Z',
  updatedAt: '2026-10-06T22:00:00.000Z',
  version: 'AAAAAAAAAAE=',
}

describe('parseClientForm', () => {
  it('normalizes RFC, email, and quote prefix', () => {
    const parsed = parseClientForm(
      form({
        rfc: 'abc 010203-1a2',
        email: 'Compras@Acme.example',
        quotePrefix: 'acme',
        phoneCountryCode: '+52',
        phone: '3333333333',
        tradeName: 'Acme',
      }),
      catalog,
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok) {
      return
    }

    expect(parsed.payload.rfc).toBe('ABC0102031A2')
    expect(parsed.payload.email).toBe('compras@acme.example')
    expect(parsed.payload.quotePrefix).toBe('ACME')
    expect(parsed.payload.currency).toBe('MXN')
    expect(parsed.payload.address.country).toBe('MX')
    expect(parsed.payload.phoneCountryCode).toBe('+52')
    expect(parsed.payload.phone).toBe('3333333333')
  })

  it('accepts the generic public and foreign RFCs', () => {
    expect(parseClientForm(form({ rfc: 'XAXX010101000', taxRegime: '612' }), catalog).ok).toBe(true)
    expect(parseClientForm(form({ rfc: 'xexx-010101-000', taxRegime: '626' }), catalog).ok).toBe(true)
  })

  it('accepts a 13-character persona física RFC with a matching regime', () => {
    const parsed = parseClientForm(form({ rfc: 'GODE561231GR8', taxRegime: '612' }), catalog)

    expect(parsed.ok).toBe(true)

    if (parsed.ok) {
      expect(parsed.payload.rfc).toBe('GODE561231GR8')
    }
  })

  it('rejects an RFC that is not 12 or 13 characters or has an impossible date', () => {
    expect(issueKeys(form({ rfc: 'ABC' }))).toContain('rfc:rfc')
    expect(issueKeys(form({ rfc: 'ABC000230AAA' }))).toContain('rfc:rfcDate')
  })

  it('requires a 5-digit fiscal postal code', () => {
    expect(issueKeys(form({ fiscalPostalCode: '4505' }))).toContain(
      'fiscalPostalCode:fiscalPostalCode',
    )
    expect(issueKeys(form({ fiscalPostalCode: '45A50' }))).toContain(
      'fiscalPostalCode:fiscalPostalCode',
    )
  })

  it('requires an uppercase alphanumeric quote prefix of 2 to 12 characters', () => {
    expect(issueKeys(form({ quotePrefix: 'A' }))).toContain('quotePrefix:quotePrefix')
    expect(issueKeys(form({ quotePrefix: 'AC-ME' }))).toContain('quotePrefix:quotePrefix')
    expect(parseClientForm(form({ quotePrefix: 'bosch01' }), catalog).ok).toBe(true)
  })

  it('requires the calling code and phone together', () => {
    expect(issueKeys(form({ phoneCountryCode: '+52', phone: '' }))).toEqual(
      expect.arrayContaining(['phone:phonePair', 'phoneCountryCode:phonePair']),
    )
    expect(issueKeys(form({ phoneCountryCode: '', phone: '3333333333' }))).toEqual(
      expect.arrayContaining(['phone:phonePair', 'phoneCountryCode:phonePair']),
    )
    expect(issueKeys(form({ phoneCountryCode: '52', phone: '3333333333' }))).toContain(
      'phoneCountryCode:phoneCode',
    )
    expect(issueKeys(form({ phoneCountryCode: '+52', phone: '123' }))).toContain('phone:phone')
    expect(parseClientForm(form({ phoneCountryCode: '', phone: '' }), catalog).ok).toBe(true)
  })

  it('rejects a tax regime or CFDI use that does not apply to the RFC person type', () => {
    expect(issueKeys(form({ rfc: 'GODE561231GR8', taxRegime: '601' }))).toContain(
      'taxRegime:taxRegimePerson',
    )
    expect(issueKeys(form({ cfdiUse: 'CN01' }))).toContain('cfdiUse:cfdiUsePerson')
    expect(issueKeys(form({ taxRegime: '999' }))).toContain('taxRegime:taxRegime')
  })

  it('rejects payment terms outside 0 to 365 and empty required commercial fields', () => {
    expect(issueKeys(form({ paymentTermsDays: '366' }))).toContain('paymentTermsDays:paymentTerms')
    expect(issueKeys(form({ paymentTermsDays: '-1' }))).toContain('paymentTermsDays:paymentTerms')
    expect(issueKeys(form({ legalName: '   ' }))).toContain('legalName:legalName')
    expect(issueKeys(form({ email: 'not-an-email' }))).toContain('email:email')

    const parsed = parseClientForm(form({ paymentTermsDays: '0' }), catalog)

    expect(parsed.ok).toBe(true)

    if (parsed.ok) {
      expect(parsed.payload.paymentTermsDays).toBe(0)
    }
  })
})

describe('parseClientPatch', () => {
  it('sends the row version and only the fields that changed', () => {
    const parsed = parseClientPatch(
      form({
        tradeName: 'Acme Norte',
        email: 'compras@acme.example',
        phoneCountryCode: '+52',
        phone: '3333333333',
        paymentTermsDays: '30',
        street: 'Av. Ejemplo',
        exteriorNumber: '100',
        colonia: 'Centro',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'MX',
        postalCode: '45050',
      }),
      catalog,
      original,
    )

    expect(parsed).toEqual({
      ok: true,
      payload: { tradeName: 'Acme Norte', version: 'AAAAAAAAAAE=' },
    })
  })

  it('clears an optional field with null and keeps the phone pair together', () => {
    const parsed = parseClientPatch(
      form({
        tradeName: '',
        phoneCountryCode: '',
        phone: '',
        email: 'compras@acme.example',
        paymentTermsDays: '30',
        street: 'Av. Ejemplo',
        exteriorNumber: '100',
        colonia: 'Centro',
        city: 'Zapopan',
        state: 'Jalisco',
        postalCode: '45050',
      }),
      catalog,
      original,
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok || !parsed.payload) {
      return
    }

    expect(parsed.payload.tradeName).toBeNull()
    expect(parsed.payload.phone).toBeNull()
    expect(parsed.payload.phoneCountryCode).toBeNull()
    expect(parsed.payload.version).toBe('AAAAAAAAAAE=')
  })

  it('returns null when nothing but the version would be sent', () => {
    const parsed = parseClientPatch(
      form({
        tradeName: 'Acme',
        email: 'compras@acme.example',
        phoneCountryCode: '+52',
        phone: '3333333333',
        paymentTermsDays: '30',
        street: 'Av. Ejemplo',
        exteriorNumber: '100',
        colonia: 'Centro',
        city: 'Zapopan',
        state: 'Jalisco',
        postalCode: '45050',
      }),
      catalog,
      original,
    )

    expect(parsed).toEqual({ ok: true, payload: null })
  })
})

describe('parseContactForm', () => {
  it('requires a name and a contact phone with at least 7 digits', () => {
    expect(parseContactForm({ name: '  ', position: '', email: '', phone: '', isPrimary: false })).toEqual({
      ok: false,
      issues: [{ path: 'name', key: 'contactName' }],
    })

    const invalidPhone = parseContactForm({
      name: 'María López',
      position: '',
      email: '',
      phone: '33-33',
      isPrimary: true,
    })

    expect(invalidPhone.ok).toBe(false)

    const parsed = parseContactForm({
      name: ' María López ',
      position: 'Compras',
      email: 'Maria@Acme.example',
      phone: '+52 33 3333 3333',
      isPrimary: true,
    })

    expect(parsed).toEqual({
      ok: true,
      payload: {
        name: 'María López',
        position: 'Compras',
        email: 'maria@acme.example',
        phone: '+52 33 3333 3333',
        isPrimary: true,
      },
    })
  })
})
