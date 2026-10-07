import { useEffect, useId, useRef, useState } from 'react'
import type { ClientRepository } from '@/features/clients/domain/client-repository'
import { validateLogoFile, type LogoFileProblem } from '@/features/clients/domain/logo'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { clientBannerMessage } from '@/features/clients/presentation/messages'
import { ConfirmDialog } from '@/features/clients/presentation/components/confirm-dialog'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function ClientLogo({
  clientId,
  hasLogo,
  revision,
  repository,
  onChanged,
}: {
  clientId: string
  hasLogo: boolean
  revision: number
  repository: ClientRepository
  onChanged: (hasLogo: boolean) => void
}) {
  const { t } = useI18n()
  const copy = t.clients.detail
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!hasLogo) {
      setObjectUrl(null)
      return
    }

    let cancelled = false
    let url: string | null = null
    const controller = new AbortController()

    void repository
      .getLogo(clientId, { signal: controller.signal })
      .then((blob) => {
        if (cancelled) {
          return
        }

        url = URL.createObjectURL(blob)
        setObjectUrl(url)
        setMessage(null)
      })
      .catch((error: unknown) => {
        const mapped = mapClientError(error)

        if (cancelled || mapped.aborted) {
          return
        }

        setObjectUrl(null)
        setMessage(clientBannerMessage(t.clients, mapped))
      })

    return () => {
      cancelled = true
      controller.abort()

      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [clientId, hasLogo, repository, revision, t.clients])

  function problemMessage(problem: LogoFileProblem): string {
    switch (problem) {
      case 'empty':
        return t.clients.errors.logoEmpty
      case 'too_large':
        return t.clients.errors.logoTooLarge
      case 'unsupported':
        return t.clients.errors.logoUnsupported
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) {
      return
    }

    const problem = await validateLogoFile(file)

    if (problem) {
      setMessage(problemMessage(problem))
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      await repository.uploadLogo(clientId, file)
      onChanged(true)
    } catch (error) {
      const mapped = mapClientError(error)
      setMessage(clientBannerMessage(t.clients, mapped))
    } finally {
      setUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setMessage(null)

    try {
      await repository.deleteLogo(clientId)
      setConfirmDelete(false)
      onChanged(false)
    } catch (error) {
      const mapped = mapClientError(error)
      setMessage(clientBannerMessage(t.clients, mapped))
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className={AppTextStyles.h3}>{copy.logo}</h2>
      <p className={cn(AppTextStyles.caption, 'mt-1')}>{copy.logoHint}</p>
      <div className="mt-4 flex h-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface-muted">
        {objectUrl ? (
          <img src={objectUrl} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className={AppTextStyles.bodySm}>{copy.logoEmpty}</span>
        )}
      </div>
      {message ? (
        <p role="alert" className="mt-3 text-xs text-red-600">
          {message}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void handleFile(event.target.files?.[0])
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? copy.uploading : hasLogo ? copy.replaceLogo : copy.uploadLogo}
        </Button>
        {hasLogo ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={uploading || deleting}
            onClick={() => setConfirmDelete(true)}
          >
            {copy.deleteLogo}
          </Button>
        ) : null}
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title={copy.deleteLogoTitle}
        body={copy.deleteLogoBody}
        confirmLabel={copy.deleteLogo}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.clients.closeDialog}
        pending={deleting}
        destructive
        onConfirm={() => {
          void handleDelete()
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </section>
  )
}
