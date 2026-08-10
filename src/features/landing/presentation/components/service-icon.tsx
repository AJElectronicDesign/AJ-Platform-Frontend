import type { ReactNode } from 'react'
import {
  AppColorClasses,
  AppIcons,
  resolveAppIcon,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ServiceIconProps {
  name?: string
  className?: string
}

function IconFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1',
        AppColorClasses.bg.brand50,
        AppColorClasses.text.brand700,
        AppColorClasses.ring.brand100,
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const iconKey = resolveAppIcon(name)
  const Icon = AppIcons[iconKey]

  return (
    <IconFrame className={className}>
      <Icon />
    </IconFrame>
  )
}
