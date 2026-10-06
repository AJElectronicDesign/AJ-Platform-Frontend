import { useI18n } from '@/shared/i18n'
import { AppGradients, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function SessionLoading({ fill = true }: { fill?: boolean }) {
  const { t } = useI18n()

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fill ? cn('min-h-screen', AppGradients.surfaceAqua) : 'py-24',
      )}
    >
      <p className={AppTextStyles.bodySm} role="status">
        {t.app.session.loading}
      </p>
    </div>
  )
}
