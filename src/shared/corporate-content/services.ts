import type { ServiceRecord } from './types'

export const services: ServiceRecord[] = [
  {
    id: 'hardware',
    icon: 'hardware',
    relatedTechnologies: ['PCB Design'],
  },
  {
    id: 'firmware',
    icon: 'firmware',
    relatedTechnologies: ['Embedded Linux', 'BLE', 'IoT'],
  },
  {
    id: 'software',
    icon: 'software',
    relatedTechnologies: ['Flutter', 'React', 'Node.js', 'AWS', 'Databases', 'APIs'],
  },
  {
    id: 'industrial-design',
    icon: 'industrial-design',
    relatedTechnologies: ['3D modeling', 'Mechanical design'],
  },
  {
    id: 'manufacture',
    icon: 'manufacture',
    relatedTechnologies: ['SMT', 'TH', 'Testing', 'Inspection', 'Packaging'],
  },
]
