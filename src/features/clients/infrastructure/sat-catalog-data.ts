import type { SatCatalogEntry } from '@/features/clients/domain/client'

/** Dev-only copy of the backend SAT lists, served by the clients mock. */
export const TAX_REGIMES: readonly SatCatalogEntry[] = [
  { code: '601', description: 'General de Ley Personas Morales', appliesTo: 'moral' },
  { code: '603', description: 'Personas Morales con Fines no Lucrativos', appliesTo: 'moral' },
  { code: '605', description: 'Sueldos y Salarios e Ingresos Asimilados a Salarios', appliesTo: 'fisica' },
  { code: '606', description: 'Arrendamiento', appliesTo: 'fisica' },
  { code: '607', description: 'Régimen de Enajenación o Adquisición de Bienes', appliesTo: 'moral' },
  { code: '608', description: 'Demás ingresos', appliesTo: 'fisica' },
  {
    code: '610',
    description: 'Residentes en el Extranjero sin Establecimiento Permanente en México',
    appliesTo: 'both',
  },
  { code: '611', description: 'Ingresos por Dividendos (socios y accionistas)', appliesTo: 'fisica' },
  {
    code: '612',
    description: 'Personas Físicas con Actividades Empresariales y Profesionales',
    appliesTo: 'fisica',
  },
  { code: '614', description: 'Ingresos por intereses', appliesTo: 'fisica' },
  { code: '615', description: 'Régimen de los ingresos por obtención de premios', appliesTo: 'fisica' },
  { code: '616', description: 'Sin obligaciones fiscales', appliesTo: 'fisica' },
  {
    code: '620',
    description: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
    appliesTo: 'moral',
  },
  { code: '621', description: 'Incorporación Fiscal', appliesTo: 'fisica' },
  {
    code: '622',
    description: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
    appliesTo: 'moral',
  },
  { code: '623', description: 'Opcional para Grupos de Sociedades', appliesTo: 'moral' },
  { code: '624', description: 'Coordinados', appliesTo: 'moral' },
  {
    code: '625',
    description:
      'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
    appliesTo: 'fisica',
  },
  { code: '626', description: 'Régimen Simplificado de Confianza', appliesTo: 'both' },
]

export const CFDI_USES: readonly SatCatalogEntry[] = [
  { code: 'G01', description: 'Adquisición de mercancías', appliesTo: 'both' },
  { code: 'G02', description: 'Devoluciones, descuentos o bonificaciones', appliesTo: 'both' },
  { code: 'G03', description: 'Gastos en general', appliesTo: 'both' },
  { code: 'I01', description: 'Construcciones', appliesTo: 'both' },
  { code: 'I02', description: 'Mobiliario y equipo de oficina por inversiones', appliesTo: 'both' },
  { code: 'I03', description: 'Equipo de transporte', appliesTo: 'both' },
  { code: 'I04', description: 'Equipo de cómputo y accesorios', appliesTo: 'both' },
  { code: 'I05', description: 'Dados, troqueles, moldes, matrices y herramental', appliesTo: 'both' },
  { code: 'I06', description: 'Comunicaciones telefónicas', appliesTo: 'both' },
  { code: 'I07', description: 'Comunicaciones satelitales', appliesTo: 'both' },
  { code: 'I08', description: 'Otra maquinaria y equipo', appliesTo: 'both' },
  { code: 'D01', description: 'Honorarios médicos, dentales y gastos hospitalarios', appliesTo: 'fisica' },
  { code: 'D02', description: 'Gastos médicos por incapacidad o discapacidad', appliesTo: 'fisica' },
  { code: 'D03', description: 'Gastos funerales', appliesTo: 'fisica' },
  { code: 'D04', description: 'Donativos', appliesTo: 'fisica' },
  {
    code: 'D05',
    description: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)',
    appliesTo: 'fisica',
  },
  { code: 'D06', description: 'Aportaciones voluntarias al SAR', appliesTo: 'fisica' },
  { code: 'D07', description: 'Primas por seguros de gastos médicos', appliesTo: 'fisica' },
  { code: 'D08', description: 'Gastos de transportación escolar obligatoria', appliesTo: 'fisica' },
  {
    code: 'D09',
    description: 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
    appliesTo: 'fisica',
  },
  { code: 'D10', description: 'Pagos por servicios educativos (colegiaturas)', appliesTo: 'fisica' },
  { code: 'S01', description: 'Sin efectos fiscales', appliesTo: 'both' },
  { code: 'CP01', description: 'Pagos', appliesTo: 'both' },
  { code: 'CN01', description: 'Nómina', appliesTo: 'fisica' },
]
