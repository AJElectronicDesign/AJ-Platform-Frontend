import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/shared/components/site-footer'
import { SiteHeader } from '@/shared/components/site-header/site-header'
import { useScrollToHash } from '@/shared/hooks/use-scroll-to-hash'

export function PublicLayout() {
  useScrollToHash()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
