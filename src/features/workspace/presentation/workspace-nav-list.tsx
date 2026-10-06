import { NavLink } from 'react-router-dom'
import { workspaceNav } from '@/features/workspace/presentation/workspace-nav'
import { useI18n } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'

export function WorkspaceNavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n()

  return (
    <nav aria-label={t.app.shell.navigation} className="flex flex-col gap-1">
      {workspaceNav.map((item) => (
        <NavLink
          key={item.id}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 font-semibold text-brand-800'
                : 'text-ink-muted hover:bg-brand-50 hover:text-brand-800',
            )
          }
        >
          {t.app.modules[item.id]}
        </NavLink>
      ))}
    </nav>
  )
}
