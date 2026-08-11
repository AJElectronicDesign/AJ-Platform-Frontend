import type { ButtonHTMLAttributes, ReactNode } from 'react'
import {
  AppColorClasses,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'soft'
  | 'secondaryOnDark'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    AppColorClasses.bg.brand700,
    AppColorClasses.text.white,
    AppShadows.sm,
    AppColorClasses.hover.bgBrand800,
    'hover:shadow-md focus-visible:ring-brand-500',
  ),
  secondary: cn(
    AppColorClasses.border.DEFAULT,
    AppColorClasses.bg.white,
    AppColorClasses.text.ink,
    AppShadows.sm,
    'border',
    AppColorClasses.hover.borderBrand200,
    AppColorClasses.hover.bgBrand50,
    AppColorClasses.hover.textBrand800,
    'focus-visible:ring-brand-500',
  ),
  secondaryOnDark: cn(
    'border bg-transparent',
    AppColorClasses.border.onDarkStrong,
    AppColorClasses.text.onDark,
    'hover:border-brand-300/50 hover:bg-white/5 hover:text-brand-300',
    'focus-visible:ring-brand-300',
  ),
  soft: cn(
    AppColorClasses.bg.brand50,
    AppColorClasses.text.brand800,
    AppColorClasses.hover.bgBrand100,
    'focus-visible:ring-brand-500',
  ),
  ghost: cn(
    AppColorClasses.text.inkMuted,
    AppColorClasses.hover.bgSurfaceMuted,
    AppColorClasses.hover.textInk,
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'secondaryOnDark' && 'focus-visible:ring-offset-navy',
        AppTextStyles.button,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
