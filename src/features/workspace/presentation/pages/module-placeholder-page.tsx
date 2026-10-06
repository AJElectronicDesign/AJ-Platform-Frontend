import type { WorkspaceModuleId } from '@/features/workspace/presentation/workspace-nav'
import { Container } from '@/shared/components/container'
import { useI18n } from '@/shared/i18n'
import { AppGradients, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function ModulePlaceholderPage({ moduleId }: { moduleId: WorkspaceModuleId }) {
  const { t } = useI18n()

  return (
    <section
      className={cn(
        'relative min-h-[calc(100vh-4rem)] overflow-hidden lg:min-h-[calc(100vh-4.25rem)]',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />
      <Container className="relative py-16 sm:py-20">
        <p className={AppTextStyles.eyebrow}>{t.app.modules[moduleId]}</p>
        <h1 className={cn(AppTextStyles.h2, 'mt-3')}>{t.app.placeholder.title}</h1>
        <p className={cn(AppTextStyles.bodySm, 'mt-3 max-w-xl')}>
          {t.app.placeholder.description}
        </p>
      </Container>
    </section>
  )
}
