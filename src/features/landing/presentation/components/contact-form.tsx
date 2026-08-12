import { useState, type FormEvent } from 'react'
import { sendContactMessage } from '@/features/landing/application/use-cases/send-contact-message'
import { emailJsContactSender } from '@/features/landing/infrastructure/services/emailjs-contact-sender'
import { brand } from '@/shared/constants/brand'
import { useI18n } from '@/shared/i18n'
import {
  AppColorClasses,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { cn } from '@/shared/utils/cn'

export function ContactForm() {
  const { t } = useI18n()
  const copy = t.home.contactForm
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: copy.validationError })
      setIsSubmitting(false)
      return
    }

    const result = await sendContactMessage(emailJsContactSender, {
      name,
      email,
      phone,
      message,
    })

    setFeedback({
      type: result.success ? 'success' : 'error',
      text: result.success ? copy.success : copy.sendError,
    })

    if (result.success) {
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
    }

    setIsSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'space-y-4 border p-6 sm:p-8',
        AppRadius.xl,
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.white,
        AppShadows.soft,
      )}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className={AppTextStyles.label}>{copy.name}</span>
          <Input
            name="name"
            autoComplete="name"
            placeholder={copy.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
        <label className="block space-y-2 text-sm">
          <span className={AppTextStyles.label}>{copy.email}</span>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isSubmitting}
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className={AppTextStyles.label}>{copy.phone}</span>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={copy.phonePlaceholder}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          disabled={isSubmitting}
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className={AppTextStyles.label}>{copy.message}</span>
        <Textarea
          name="message"
          placeholder={copy.messagePlaceholder}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          disabled={isSubmitting}
        />
      </label>

      {feedback ? (
        <p
          className={cn(
            'border px-3 py-2 text-sm',
            AppRadius.md,
            feedback.type === 'success'
              ? 'border-brand-100 bg-brand-50 text-brand-800'
              : 'border-red-200 bg-red-50 text-red-700',
          )}
          role="status"
        >
          {feedback.text}
        </p>
      ) : (
        <p className={cn(AppTextStyles.caption, AppColorClasses.text.inkSubtle)}>
          {copy.sentTo} {brand.contact.email}.
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.sending : t.common.requestQuotation}
        </Button>
      </div>
    </form>
  )
}
