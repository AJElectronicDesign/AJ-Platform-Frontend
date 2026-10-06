import { useAuth } from '@/features/auth/presentation/use-auth'
import { useI18n } from '@/shared/i18n'
import { AppGradients, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function SessionErrorState({ fill = true }: { fill?: boolean }) {
  const { t } = useI18n()
  const { sessionError, retry } = useAuth()
  const message =
    sessionError === 'network' ? t.auth.session.network : t.auth.session.unavailable

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        fill ? cn('min-h-screen', AppGradients.surfaceAqua) : 'py-24',
      )}
      role="alert"
    >
      <p className={cn(AppTextStyles.bodySm, 'max-w-sm')}>{message}</p>
      <Button type="button" className="mt-4" onClick={retry}>
        {t.auth.session.retry}
      </Button>
    </div>
  )
}
