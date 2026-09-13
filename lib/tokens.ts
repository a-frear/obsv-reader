import type { CSSProperties } from 'react'
import type { Margin, Page, Typeface } from '@/lib/types'

/**
 * Per-page knobs -> CSS custom properties.
 *
 * In Phase 2 the palette and ramps come from the Sanity `theme` document;
 * this function stays the single place where a page's fields become style.
 */

const FONT: Record<Typeface, string> = {
  serif: 'var(--font-serif)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
}

const MARGIN: Record<Margin, string> = {
  none: '0',
  tight: '4vmin',
  normal: '8vmin',
  wide: '14vmin',
}

/** Relative luminance, sRGB, for picking ink that can actually be read. */
function luminance(hex: string): number {
  const m = hex.replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (full.length !== 6) return 0
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Ink defaults to whichever of light/dark actually reads against the ground.
 * She can still choose a deliberately low-contrast page later via the theme —
 * this only keeps the *default* legible so she isn't fighting it on every page.
 */
export function inkFor(ground?: string): string {
  if (!ground?.startsWith('#')) return '#f4f1ea'
  return luminance(ground) > 0.45 ? '#14150f' : '#f4f1ea'
}

export function pageStyle(page: Page): CSSProperties {
  const ink = inkFor(page.ground)

  return {
    '--page-ground': page.ground ?? 'var(--ground)',
    '--page-font': FONT[page.typeface ?? 'serif'],
    '--ink': ink,
    '--ink-dim': `color-mix(in srgb, ${ink} 55%, transparent)`,
    '--rule': `color-mix(in srgb, ${ink} 18%, transparent)`,
    '--margin': MARGIN[page.margin ?? 'normal'],
    ...(page.typeScale ? { '--type-scale': String(page.typeScale) } : {}),
    ...(page.measure ? { '--measure': `${page.measure}ch` } : {}),
    ...(page.tracking ? { '--tracking': `${page.tracking}em` } : {}),
    ...(page.entryDuration ? { '--entry-duration': `${page.entryDuration}ms` } : {}),
  } as CSSProperties
}
