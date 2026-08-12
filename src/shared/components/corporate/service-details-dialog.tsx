import type { RefObject } from 'react'
import type { Service } from '@/shared/corporate-content'
import { ServiceIcon } from '@/shared/components/corporate/service-icon'
import { useI18n } from '@/shared/i18n'
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
  const { t } = useI18n()

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
          <h3 className={AppTextStyles.microLabel}>{t.common.whatWeDo}</h3>
          <ul className={cn(AppTextStyles.bodySm, 'mt-3 list-disc space-y-1.5 pl-5')}>
            {service.details.capabilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className={AppTextStyles.microLabel}>
            {t.common.typicalDeliverables}
          </h3>
          <ul className={cn(AppTextStyles.bodySm, 'mt-3 list-disc space-y-1.5 pl-5')}>
            {service.details.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {service.details.technologies &&
        service.details.technologies.length > 0 ? (
          <section>
            <h3 className={AppTextStyles.microLabel}>
              {t.common.relatedTechnologies}
            </h3>
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
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onRequestQuotation}
          >
            {t.common.requestQuotation}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
