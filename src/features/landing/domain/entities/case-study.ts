export type CaseStudyImageKey = 'iotGateway' | 'connectedDevice'

export interface CaseStudy {
  id: string
  title: string
  summary: string
  industry?: string
  outcome?: string
  imageAlt?: string
  /** Key into AppImages.landing.caseStudies for easy photography swaps. */
  imageKey?: CaseStudyImageKey
}
