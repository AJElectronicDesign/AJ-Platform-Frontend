import { Link } from 'react-router-dom'
import { brand } from '@/shared/constants/brand'
import { AppColorClasses, AppImages } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface AppLogoProps {
  className?: string
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80',
        AppColorClasses.text.ink,
        className,
      )}
    >
      <img
        src={AppImages.brand.logo}
        alt={`${brand.name} logo`}
        className="h-9 w-9 rounded-full object-cover ring-1 ring-border/70 sm:h-10 sm:w-10"
      />
      <span className="text-[0.95rem]">{brand.name}</span>
    </Link>
  )
}
