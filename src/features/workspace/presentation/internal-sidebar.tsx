import { Link } from 'react-router-dom'
import { WorkspaceNavList } from '@/features/workspace/presentation/workspace-nav-list'
import { brand } from '@/shared/constants/brand'
import { paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppImages, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function InternalBrandLink({ className }: { className?: string }) {
  return (
    <Link
      to={paths.app}
      className={cn(
        'inline-flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80',
        AppColorClasses.text.ink,
        className,
      )}
    >
      <img
        src={AppImages.brand.logo}
        alt={`${brand.name} logo`}
        className="h-9 w-9 overflow-hidden rounded-full object-cover"
      />
      <span className="text-[0.95rem]">{brand.name}</span>
    </Link>
  )
}

export function InternalSidebar() {
  const { t } = useI18n()

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-border/70 bg-white lg:flex">
      <div className="flex h-16 items-center px-5 lg:h-[4.25rem]">
        <InternalBrandLink />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-6">
        <p className={cn(AppTextStyles.microLabel, 'px-3 pb-2')}>
          {t.app.shell.navigation}
        </p>
        <WorkspaceNavList />
        <Link
          to={paths.home}
          className={cn(AppTextStyles.link, 'mt-auto px-3 pt-6')}
        >
          {t.app.shell.publicSite}
        </Link>
      </div>
    </aside>
  )
}
