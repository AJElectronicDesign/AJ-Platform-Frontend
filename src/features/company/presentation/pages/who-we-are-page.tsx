import { CompanyOverviewSection } from '@/features/company/presentation/sections/company-overview-section'
import { LeadersSection } from '@/features/company/presentation/sections/leaders-section'
import { OurPeopleSection } from '@/features/company/presentation/sections/our-people-section'
import { PurposeValuesSection } from '@/features/company/presentation/sections/purpose-values-section'

export function WhoWeArePage() {
  return (
    <>
      <CompanyOverviewSection />
      <PurposeValuesSection />
      <OurPeopleSection />
      <LeadersSection />
    </>
  )
}
