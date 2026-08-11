import { AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  /** Optional second line rendered in brand teal for dual-tone headings. */
  titleAccent?: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeaderProps) {
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            isDark ? AppTextStyles.eyebrowOnDark : AppTextStyles.eyebrow,
            'mb-3',
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2 className={isDark ? AppTextStyles.h2OnDark : AppTextStyles.h2}>
        <span className="block">{title}</span>
        {titleAccent ? (
          <span
            className={cn(
              'block',
              isDark
                ? AppTextStyles.headingAccentOnDark
                : AppTextStyles.headingAccent,
            )}
          >
            {titleAccent}
          </span>
        ) : null}
      </h2>

      {description ? (
        <p
          className={cn(
            isDark ? AppTextStyles.bodyOnDark : AppTextStyles.body,
            'mt-4',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
