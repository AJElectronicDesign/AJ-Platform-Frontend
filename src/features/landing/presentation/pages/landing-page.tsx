import { ClientsSection } from '@/features/landing/presentation/sections/clients-section'
import { ContactSection } from '@/features/landing/presentation/sections/contact-section'
import { HeroSection } from '@/features/landing/presentation/sections/hero-section'
import { ServicesSection } from '@/features/landing/presentation/sections/services-section'
import { TeamSection } from '@/features/landing/presentation/sections/team-section'
import { TechnologiesSection } from '@/features/landing/presentation/sections/technologies-section'
import { VideoSection } from '@/features/landing/presentation/sections/video-section'
import { useLandingContent } from '@/features/landing/presentation/hooks/use-landing-content'

export function LandingPage() {
  const { content } = useLandingContent()

  return (
    <>
      <HeroSection content={content.hero} />
      <ClientsSection
        intro={content.clientsSection}
        clients={content.clients}
      />
      <ServicesSection
        intro={content.servicesSection}
        services={content.services}
      />
      <TeamSection content={content.teamSection} />
      <TechnologiesSection
        intro={content.technologiesSection}
        technologies={content.technologies}
      />
      <VideoSection content={content.video} />
      <ContactSection
        intro={content.contactSection}
        contact={content.contact}
      />
    </>
  )
}
