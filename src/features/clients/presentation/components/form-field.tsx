import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Input, type InputProps } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils/cn'

const errorClass = cn(AppTextStyles.caption, AppColorClasses.text.danger)

function fieldDescribedBy(id: string, error?: string, hint?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(
    (value): value is string => Boolean(value),
  )

  return ids.length > 0 ? ids.join(' ') : undefined
}

function FieldChrome({
  id,
  label,
  error,
  hint,
  children,
  className,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block space-y-2', className)} htmlFor={id}>
      <span className={AppTextStyles.label}>{label}</span>
      {children}
      {hint ? (
        <span id={`${id}-hint`} className={AppTextStyles.caption}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${id}-error`} className={errorClass}>
          {error}
        </span>
      ) : null}
    </label>
  )
}

interface FieldBase {
  id: string
  label: string
  error?: string
  hint?: string
  className?: string
}

export function TextField({ id, label, error, hint, className, ...props }: FieldBase & InputProps) {
  return (
    <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        {...props}
      />
    </FieldChrome>
  )
}

export function AreaField({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
      <Textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        {...props}
      />
    </FieldChrome>
  )
}

export function SelectField({
  id,
  label,
  error,
  hint,
  className,
  children,
  ...props
}: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
      <Select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        {...props}
      >
        {children}
      </Select>
    </FieldChrome>
  )
}
