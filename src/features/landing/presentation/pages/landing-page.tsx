import { CaseStudiesSection } from '@/features/landing/presentation/sections/case-studies-section'
import { ContactSection } from '@/features/landing/presentation/sections/contact-section'
import { FooterSection } from '@/features/landing/presentation/sections/footer-section'
import { HeroSection } from '@/features/landing/presentation/sections/hero-section'
import { ProcessSection } from '@/features/landing/presentation/sections/process-section'
import { ServicesSection } from '@/features/landing/presentation/sections/services-section'
import { TechnologiesSection } from '@/features/landing/presentation/sections/technologies-section'
import { ValuePropositionSection } from '@/features/landing/presentation/sections/value-proposition-section'
import { VideoSection } from '@/features/landing/presentation/sections/video-section'
import { useLandingContent } from '@/features/landing/presentation/hooks/use-landing-content'
import { Container } from '@/shared/components/container'

export function LandingPage() {
  const { content, isLoading, error } = useLandingContent()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <Container>
          <div className="flex items-center gap-3 text-ink-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
            <p className="text-sm font-medium">Loading experience...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white">
        <Container>
          <p className="text-sm font-medium text-red-600">
            {error ?? 'Content unavailable.'}
          </p>
        </Container>
      </div>
    )
  }

  return (
    <>
      <HeroSection content={content.hero} />
      <ValuePropositionSection content={content.valueProposition} />
      <ServicesSection
        intro={content.servicesSection}
        services={content.services}
      />
      <ProcessSection intro={content.processSection} steps={content.process} />
      <TechnologiesSection
        intro={content.technologiesSection}
        technologies={content.technologies}
      />
      <CaseStudiesSection
        intro={content.caseStudiesSection}
        caseStudies={content.caseStudies}
      />
      <VideoSection content={content.video} />
      <ContactSection
        intro={content.contactSection}
        contact={content.contact}
      />
      <FooterSection
        copyright={content.footer.copyright}
        email={content.contact.email}
        phone={content.contact.phone}
        location={content.contact.location}
      />
    </>
  )
}
