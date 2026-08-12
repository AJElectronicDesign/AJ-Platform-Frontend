import { Link } from 'react-router-dom'
import { myAjHref } from '@/shared/constants/navigation'
import { useI18n } from '@/shared/i18n'
import { AppIcons, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function MyAjAccess({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n()

  return (
    <Link
      to={myAjHref}
      onClick={onNavigate}
      className={cn(
        AppTextStyles.navLink,
        'inline-flex h-10 items-center gap-1.5 px-2.5',
      )}
    >
      <AppIcons.user className="h-4 w-4" />
      <span>{t.common.myAj}</span>
    </Link>
  )
}
