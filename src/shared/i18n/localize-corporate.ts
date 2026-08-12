import {
  clients,
  process,
  services,
  technologies,
  technologyCategories,
  type ClientLogo,
  type ProcessStep,
  type Service,
  type Technology,
  type TechnologyCategory,
} from '@/shared/corporate-content'
import type { HomeCatalog } from './types'

export function localizeServices(copy: HomeCatalog): Service[] {
  return services.map((record) => {
    const strings = copy.services[record.id]

    if (!strings) {
      throw new Error(`Missing i18n copy for service "${record.id}"`)
    }

    return {
      ...record,
      title: strings.title,
      description: strings.description,
      benefit: strings.benefit,
      details: {
        introduction: strings.details.introduction,
        capabilities: strings.details.capabilities,
        deliverables: strings.details.deliverables,
        technologies: record.relatedTechnologies,
      },
    }
  })
}

export function localizeClients(copy: HomeCatalog): ClientLogo[] {
  return clients.map((client) => ({
    ...client,
    alt: copy.clientLogoAlt.replace('{name}', client.name),
  }))
}

export function localizeProcess(copy: HomeCatalog): ProcessStep[] {
  return process.map((step) => {
    const strings = copy.process[step.id]

    if (!strings) {
      throw new Error(`Missing i18n copy for process step "${step.id}"`)
    }

    return {
      ...step,
      label: strings.label,
      description: strings.description,
    }
  })
}

export function localizeTechnologies(copy: HomeCatalog): TechnologyCategory[] {
  const byId = new Map(technologies.map((item) => [item.id, item]))

  return technologyCategories.map((category) => {
    const strings = copy.technologies[category.id]

    if (!strings) {
      throw new Error(`Missing i18n copy for technology category "${category.id}"`)
    }

    return {
      id: category.id,
      icon: category.icon,
      title: strings.title,
      description: strings.description,
      technologies: category.technologyIds.flatMap((id) => {
        const record = byId.get(id)

        if (!record) {
          return []
        }

        const technology: Technology = {
          ...record,
          name: copy.technologyNames[id] ?? id,
        }

        return [technology]
      }),
    }
  })
}
