import type { TechnologyCategoryRecord, TechnologyRecord } from './types'

export const technologies: TechnologyRecord[] = [
  { id: 'pcb-design', icon: 'pcb' },
  { id: 'component-selection', icon: 'hardware' },
  { id: 'electronic-design', icon: 'pcb' },
  { id: 'manufacturing-files', icon: 'api' },
  { id: 'embedded-linux', icon: 'linux' },
  { id: 'ble', icon: 'ble' },
  { id: 'iot', icon: 'iot' },
  { id: 'rtos', icon: 'firmware' },
  { id: 'drivers', icon: 'connectivity' },
  { id: 'flutter', icon: 'flutter' },
  { id: 'react', icon: 'react' },
  { id: 'nodejs', icon: 'nodejs' },
  { id: 'web-platforms', icon: 'applications' },
  { id: 'mobile-apps', icon: 'software' },
  { id: 'aws', icon: 'aws' },
  { id: 'databases', icon: 'database' },
  { id: 'apis', icon: 'api' },
  { id: 'cloud-services', icon: 'cloud' },
  { id: '3d-modeling', icon: 'industrial-design' },
  { id: 'mechanical-design', icon: 'industrial-design' },
  { id: 'prototyping', icon: 'pcb' },
  { id: 'smt', icon: 'manufacture' },
  { id: 'th', icon: 'manufacture' },
  { id: 'testing', icon: 'firmware' },
  { id: 'packaging', icon: 'manufacture' },
]

export const technologyCategories: TechnologyCategoryRecord[] = [
  {
    id: 'hardware-electronics',
    icon: 'hardware',
    technologyIds: [
      'pcb-design',
      'component-selection',
      'electronic-design',
      'manufacturing-files',
    ],
  },
  {
    id: 'firmware-connectivity',
    icon: 'firmware',
    technologyIds: ['embedded-linux', 'ble', 'iot', 'rtos', 'drivers'],
  },
  {
    id: 'applications-platforms',
    icon: 'applications',
    technologyIds: ['flutter', 'react', 'nodejs', 'web-platforms', 'mobile-apps'],
  },
  {
    id: 'cloud-data',
    icon: 'cloud',
    technologyIds: ['aws', 'databases', 'apis', 'cloud-services'],
  },
  {
    id: 'product-manufacturing',
    icon: 'manufacture',
    technologyIds: [
      '3d-modeling',
      'mechanical-design',
      'prototyping',
      'smt',
      'th',
      'testing',
      'packaging',
    ],
  },
]
