import {
  AppIcons,
  resolveAppIcon,
} from '@/shared/theme'
import { IconFrame } from '@/shared/components/icon-frame'
import { cn } from '@/shared/utils/cn'

export interface ServiceIconProps {
  name?: string
  className?: string
  tone?: 'light' | 'dark' | 'soft'
}

export function ServiceIcon({
  name,
  className,
  tone = 'soft',
}: ServiceIconProps) {
  const iconKey = resolveAppIcon(name)
  const Icon = AppIcons[iconKey]

  return (
    <IconFrame tone={tone} size="lg" className={className}>
      <Icon className={cn('h-5 w-5')} />
    </IconFrame>
  )
}
