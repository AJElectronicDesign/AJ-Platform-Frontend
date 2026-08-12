import { useEffect, useId, useRef, useState } from 'react'
import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import {
  AppColorClasses,
  AppGradients,
  AppIcons,
  AppImages,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface VideoSectionProps {
  content: LandingContent['video']
}

/** Drive’s player UI is built for wider viewports; below this we scale the iframe. */
const DRIVE_LAYOUT_WIDTH = 720
const NARROW_PLAYER_MQ = '(max-width: 767px)'

/**
 * Prefer the standard Drive preview URL so native controls always remain available.
 * Autoplay is attempted via a query param; if the browser or Drive ignores it,
 * the iframe still exposes Drive’s own play control.
 */
function resolvePlaybackUrl(embedUrl: string): string {
  try {
    const url = new URL(embedUrl)
    url.searchParams.set('autoplay', '1')
    return url.toString()
  } catch {
    return embedUrl
  }
}

function resolveDriveViewUrl(embedUrl: string): string | null {
  const match = embedUrl.match(/\/file\/d\/([^/?#]+)/)
  return match ? `https://drive.google.com/file/d/${match[1]}/view` : null
}

function useNarrowViewport() {
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(NARROW_PLAYER_MQ)
    const sync = () => setIsNarrow(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isNarrow
}

interface DrivePlayerProps {
  src: string
  title: string
  onReady: () => void
  /** Force scaled layout (useful in the mobile lightbox). */
  forceScale?: boolean
}

function DrivePlayer({ src, title, onReady, forceScale = false }: DrivePlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<
    | { mode: 'fill' }
    | { mode: 'scale'; scale: number; width: number; height: number }
  >({ mode: 'fill' })

  useEffect(() => {
    const host = hostRef.current
    if (!host) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      const height = entry.contentRect.height

      if (!forceScale && width >= DRIVE_LAYOUT_WIDTH) {
        setLayout({ mode: 'fill' })
        return
      }

      const scale = width / DRIVE_LAYOUT_WIDTH
      setLayout({
        mode: 'scale',
        scale,
        width: DRIVE_LAYOUT_WIDTH,
        height: scale > 0 ? height / scale : DRIVE_LAYOUT_WIDTH * (9 / 16),
      })
    })

    observer.observe(host)
    return () => observer.disconnect()
  }, [forceScale])

  return (
    <div
      ref={hostRef}
      className={cn('absolute inset-0 overflow-hidden', AppColorClasses.bg.brand50)}
    >
      <iframe
        src={src}
        title={title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={onReady}
        className={cn(
          'border-0',
          layout.mode === 'fill'
            ? 'absolute inset-0 h-full w-full max-w-full'
            : 'absolute left-0 top-0 origin-top-left',
        )}
        style={
          layout.mode === 'scale'
            ? {
                width: layout.width,
                height: layout.height,
                transform: `scale(${layout.scale})`,
              }
            : undefined
        }
      />
    </div>
  )
}

export function VideoSection({ content }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isIframeReady, setIsIframeReady] = useState(false)
  const isNarrow = useNarrowViewport()
  const lightboxTitleId = useId()
  const PlayIcon = AppIcons.play
  const CloseIcon = AppIcons.close
  const showPoster = !isPlaying || !isIframeReady
  const playbackUrl = resolvePlaybackUrl(content.embedUrl)
  const driveViewUrl = resolveDriveViewUrl(content.embedUrl)
  const useLightbox = isPlaying && isNarrow

  function startPlayback() {
    setIsIframeReady(false)
    setIsPlaying(true)
  }

  function stopPlayback() {
    setIsPlaying(false)
    setIsIframeReady(false)
  }

  useEffect(() => {
    if (!useLightbox) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsPlaying(false)
        setIsIframeReady(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [useLightbox])

  return (
    <section
      id="video"
      className={cn(
        'scroll-mt-24 overflow-x-clip py-16 sm:py-20',
        AppColorClasses.bg.surfaceAlt,
      )}
    >
      <Container className="min-w-0">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={AppTextStyles.h2}>{content.title}</h2>
          <p className={cn(AppTextStyles.body, 'mx-auto mt-4 max-w-2xl')}>
            {content.description}
          </p>
        </div>

        <div className="mx-auto mt-8 w-full min-w-0 max-w-4xl sm:mt-10">
          <div
            className={cn(
              'w-full min-w-0 overflow-hidden border',
              AppRadius.lg,
              AppColorClasses.border.brand100,
              AppColorClasses.bg.white,
              AppShadows.soft,
            )}
          >
            <div
              className={cn(
                'relative aspect-video w-full min-w-0 overflow-hidden',
                AppColorClasses.bg.brand50,
              )}
            >
              {isPlaying && !useLightbox ? (
                <DrivePlayer
                  src={playbackUrl}
                  title={content.title}
                  onReady={() => setIsIframeReady(true)}
                />
              ) : null}

              {showPoster || useLightbox ? (
                <div className="absolute inset-0 z-10">
                  <img
                    src={AppImages.landing.videoPoster}
                    alt=""
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-brand-900/35"
                    aria-hidden="true"
                  />
                  {!isPlaying ? (
                    <button
                      type="button"
                      onClick={startPlayback}
                      aria-label={content.placeholderLabel}
                      className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center gap-4 px-6',
                        'text-center transition-opacity duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-sm',
                          'shadow-sm transition-transform duration-200 motion-safe:hover:scale-105',
                          'sm:h-20 sm:w-20',
                        )}
                      >
                        <PlayIcon className="h-7 w-7 translate-x-0.5 sm:h-8 sm:w-8" />
                      </span>
                      <span className="sr-only">{content.placeholderLabel}</span>
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <p
          className={cn(
            AppTextStyles.bodySm,
            'mx-auto mt-4 max-w-2xl px-1 text-center',
          )}
        >
          {content.note}
        </p>
      </Container>

      {useLightbox ? (
        <div
          className={cn(
            'fixed inset-0 z-[90] flex h-[100dvh] w-screen flex-col',
            AppGradients.surfaceAqua,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={lightboxTitleId}
        >
          <div className="pointer-events-none absolute inset-0 circuit-tech opacity-40" />

          <div className="relative flex items-center justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
            <h3
              id={lightboxTitleId}
              className={cn(
                'truncate text-sm font-semibold',
                AppColorClasses.text.brand800,
              )}
            >
              {content.title}
            </h3>
            <button
              type="button"
              onClick={stopPlayback}
              aria-label="Close video"
              className={cn(
                'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border',
                AppColorClasses.border.brand200,
                AppColorClasses.bg.white,
                AppColorClasses.text.brand800,
                'transition-colors hover:bg-brand-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              )}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col justify-start px-2 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-center sm:px-4">
            <div
              className={cn(
                'relative w-full overflow-hidden border',
                AppRadius.lg,
                AppColorClasses.border.brand100,
                AppColorClasses.bg.white,
                AppShadows.soft,
              )}
            >
              <div
                className={cn(
                  'relative aspect-video w-full',
                  AppColorClasses.bg.brand50,
                )}
              >
                <DrivePlayer
                  src={playbackUrl}
                  title={content.title}
                  forceScale
                  onReady={() => setIsIframeReady(true)}
                />
                {!isIframeReady ? (
                  <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-white/50"
                    aria-hidden="true"
                  >
                    <span className="h-8 w-8 animate-pulse rounded-full bg-brand-200" />
                  </div>
                ) : null}
              </div>
            </div>

            {driveViewUrl ? (
              <a
                href={driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'mx-auto mt-5 inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold',
                  AppColorClasses.border.brand200,
                  AppColorClasses.bg.white,
                  AppColorClasses.text.brand800,
                  'transition-colors hover:bg-brand-50',
                )}
              >
                Open full video in Google Drive
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}
