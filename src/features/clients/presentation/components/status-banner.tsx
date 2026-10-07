import type { ReactNode } from 'react'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function StatusBanner({
  id,
  children,
  action,
}: {
  id?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div
      id={id}
      tabIndex={-1}
      role="alert"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 outline-none',
        'border-red-200 bg-red-50',
        AppTextStyles.bodySm,
        AppColorClasses.text.danger,
      )}
    >
      <p>{children}</p>
      {action}
    </div>
  )
}
