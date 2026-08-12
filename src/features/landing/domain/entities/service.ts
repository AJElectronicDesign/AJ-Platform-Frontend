export interface ServiceDetails {
  introduction: string
  capabilities: string[]
  deliverables: string[]
  /** Related technology or capability labels already used elsewhere in the project. */
  technologies?: string[]
}

export interface Service {
  id: string
  title: string
  description: string
  benefit: string
  icon?: string
  details: ServiceDetails
}
