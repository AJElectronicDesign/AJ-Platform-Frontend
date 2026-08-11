export interface Technology {
  id: string
  name: string
  icon: string
}

export interface TechnologyCategory {
  id: string
  title: string
  technologies: Technology[]
}
