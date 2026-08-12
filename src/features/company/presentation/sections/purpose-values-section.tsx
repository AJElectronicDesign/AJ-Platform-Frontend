import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { whoWeAreHash } from '@/shared/constants/paths'
import { purposeValues } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppRadius, AppShadows, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function PurposeValuesSection() {
  const { t } = useI18n()
  const copy = t.company.purposeValues

  return (
    <section
      id={whoWeAreHash.purposeValues}
      className={cn(
        'scroll-mt-24 py-16 sm:py-20',
        AppColorClasses.bg.surface,
      )}
    >
      <Container>
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">
          {purposeValues.map((item) => {
            const strings = copy.items[item.id]

            return (
              <li
                key={item.id}
                className={cn(
                  'border bg-white p-6',
                  AppRadius.xl,
                  AppShadows.soft,
                  AppColorClasses.border.DEFAULT,
                )}
              >
                <h3 className={AppTextStyles.h3}>{strings.title}</h3>
                <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
                  {strings.description}
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
