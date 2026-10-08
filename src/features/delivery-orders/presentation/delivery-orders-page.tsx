import type { ReactNode } from 'react'
import { Container } from '@/shared/components/container'

export function DeliveryOrdersPage({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-surface lg:min-h-[calc(100vh-4.25rem)]">
      <Container className="py-8 sm:py-10">{children}</Container>
    </section>
  )
}
