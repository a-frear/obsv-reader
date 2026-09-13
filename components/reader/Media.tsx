'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { MediaRef } from '@/lib/types'

/**
 * One media element, honouring the playback policy from the plan.
 *
 * The important rule it encodes: an animated asset authored as a GIF is a
 * `loop` and renders as a muted looping <video>, never as image/gif. GIFs
 * cannot be paused, seeked, or frozen from JS, which would break both the
 * page-windowing below and the reduced-motion requirement.
 *
 * Phase 1 renders `placeholder:` sources as labelled blocks. Phase 4 swaps the
 * src through lib/cloudinary.ts — the component shape does not change.
 */

const TREATMENT: Record<string, string> = {
  none: '',
  grayscale: 'grayscale(1)',
  contrast: 'contrast(1.35) saturate(0.8)',
  duotone: 'grayscale(1) sepia(0.55) hue-rotate(165deg) saturate(2.2)',
  grain: 'contrast(1.1) saturate(0.85)',
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/**
 * matchMedia is an external store, so read it as one — this both avoids a
 * render-then-correct flash and keeps the server snapshot honest (no motion
 * preference is knowable during SSR).
 */
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

export function Media({
  media,
  active,
  className,
}: {
  media: MediaRef
  /** True when this media's page is the one being read. Drives play/pause. */
  active: boolean
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)

  const filter = TREATMENT[media.treatment ?? 'none'] || undefined
  const objectPosition = media.focal
    ? `${media.focal.x * 100}% ${media.focal.y * 100}%`
    : '50% 50%'

  // Leaving a page pauses and resets, so we never pay decode cost for a page
  // nobody is reading. Under reduced motion nothing auto-plays at all.
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (active && media.kind === 'loop' && !reduced) {
      // Autoplay can still be refused; the onPlay/onPause handlers below are
      // what actually keep `playing` in step with the element.
      void el.play().catch(() => {})
    } else {
      el.pause()
      if (!active) el.currentTime = 0
    }
  }, [active, media.kind, reduced])

  if (media.src.startsWith('placeholder:')) {
    return (
      <Placeholder
        label={media.src.slice('placeholder:'.length)}
        kind={media.kind}
        focal={media.focal}
        filter={filter}
        className={className}
      />
    )
  }

  if (media.kind === 'image') {
    return (
      // Plain <img> until Phase 2: next/image needs intrinsic dimensions, which
      // arrive with the Sanity asset record. Swapped there, not here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={media.alt}
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, filter }}
      />
    )
  }

  const isLoop = media.kind === 'loop'

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        muted={isLoop}
        loop={isLoop}
        playsInline
        preload="none"
        controls={!isLoop && media.hasAudio}
        aria-label={media.alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition, filter }}
      />
      {/* Reduced motion freezes loops to their poster, so give back a way in. */}
      {isLoop && reduced && !playing && (
        <button
          type="button"
          onClick={() => void videoRef.current?.play().catch(() => {})}
          aria-label={`Play: ${media.alt}`}
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            background: 'transparent', border: 0, color: 'var(--ink)', cursor: 'pointer',
          }}
        >
          <span style={{ font: '0.7rem var(--font-mono)', letterSpacing: '0.08em', opacity: 0.8 }}>
            ▶ PLAY
          </span>
        </button>
      )}
    </div>
  )
}

/** Phase 1 stand-in. Shows kind and focal point so layout can be judged. */
function Placeholder({
  label, kind, focal, filter, className,
}: {
  label: string
  kind: string
  focal?: { x: number; y: number }
  filter?: string
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        filter,
        background:
          'repeating-linear-gradient(135deg, color-mix(in srgb, var(--ink) 7%, transparent) 0 2px, transparent 2px 9px)',
        border: '1px solid var(--rule)',
      }}
    >
      {/*
        Cornered rather than centred: a centred label collides with overlay
        text, which sits dead centre on exactly the pages most likely to be
        full-bleed. Nothing here survives real assets, but it has to stay out
        of the way while layouts are being judged.
      */}
      <span
        style={{
          position: 'absolute',
          top: '0.9rem',
          left: '0.9rem',
          right: '0.9rem',
          font: '0.62rem var(--font-mono)',
          letterSpacing: '0.1em',
          color: 'var(--ink-dim)',
          opacity: 0.65,
          textTransform: 'uppercase',
        }}
      >
        {kind} · {label}
      </span>
      {focal && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: `${focal.x * 100}%`,
            top: `${focal.y * 100}%`,
            width: 9, height: 9, margin: '-4.5px 0 0 -4.5px',
            border: '1px solid var(--ink-dim)',
            borderRadius: '50%',
            opacity: 0.5,
          }}
        />
      )}
    </div>
  )
}
