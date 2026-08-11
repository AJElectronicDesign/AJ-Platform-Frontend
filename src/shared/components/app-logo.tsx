import { Link } from 'react-router-dom'
import { brand } from '@/shared/constants/brand'
import { AppColorClasses, AppImages } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface AppLogoProps {
  className?: string
  tone?: 'light' | 'dark'
}

export function AppLogo({ className, tone = 'light' }: AppLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-80',
        tone === 'dark' ? AppColorClasses.text.onDark : AppColorClasses.text.ink,
        className,
      )}
    >
      <img
        src={AppImages.brand.logo}
        alt={`${brand.name} logo`}
        className={cn(
          'h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10',
          tone === 'dark' ? 'ring-1 ring-white/20' : 'ring-1 ring-border/70',
        )}
      />
      <span className="text-[0.95rem]">{brand.name}</span>
    </Link>
  )
}
