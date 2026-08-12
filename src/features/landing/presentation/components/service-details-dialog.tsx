import type { RefObject } from 'react'
import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceIcon } from '@/features/landing/presentation/components/service-icon'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Dialog } from '@/shared/ui/dialog'
import { cn } from '@/shared/utils/cn'

export interface ServiceDetailsDialogProps {
  service: Service | null
  open: boolean
  onClose: () => void
  onRequestQuotation: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
  restoreFocus?: boolean
}

export function ServiceDetailsDialog({
  service,
  open,
  onClose,
  onRequestQuotation,
  returnFocusRef,
  restoreFocus = true,
}: ServiceDetailsDialogProps) {
  if (!service) {
    return null
  }

  return (
    <Dialog
      open={open}
      title={service.title}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      restoreFocus={restoreFocus}
    >
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <ServiceIcon name={service.icon ?? service.id} tone="soft" />
          <p className={cn(AppTextStyles.bodySm, 'pt-1')}>
            {service.details.introduction}
          </p>
        </div>

        <section>
          <h3 className={AppTextStyles.microLabel}>What we do</h3>
          <ul className={cn(AppTextStyles.bodySm, 'mt-3 list-disc space-y-1.5 pl-5')}>
            {service.details.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className={AppTextStyles.microLabel}>Typical deliverables</h3>
          <ul className={cn(AppTextStyles.bodySm, 'mt-3 list-disc space-y-1.5 pl-5')}>
            {service.details.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {service.details.technologies &&
        service.details.technologies.length > 0 ? (
          <section>
            <h3 className={AppTextStyles.microLabel}>Related technologies</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {service.details.technologies.map((tech) => (
                <li
                  key={tech}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm font-medium text-brand-800',
                    'border-brand-100 bg-brand-50',
                  )}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="pt-1">
          <Button type="button" className="w-full sm:w-auto" onClick={onRequestQuotation}>
            Request a quotation
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
