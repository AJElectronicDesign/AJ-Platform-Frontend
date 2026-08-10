import type { FormEvent } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-ink">Name</span>
          <Input name="name" autoComplete="name" placeholder="Your name" required />
        </label>
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-ink">Email</span>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </label>
      </div>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-ink">Phone</span>
        <Input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+52 (33) 0000 0000"
        />
      </label>
      <label className="block space-y-2 text-sm">
        <span className="font-medium text-ink">Message</span>
        <Textarea
          name="message"
          placeholder="Tell us about your project, timeline and goals"
          required
        />
      </label>
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-subtle">
          Visual form only for now. We will connect this to a real submission flow later.
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Request a quotation
        </Button>
      </div>
    </form>
  )
}
