/**
 * Content types for the reader.
 *
 * This union is the contract that the Sanity schema will mirror in Phase 2 —
 * every archetype here becomes one object type in `sanity/schemas/page.ts`.
 * Keeping it a discriminated union on `archetype` is what lets the renderer
 * stay a simple map lookup with no per-page branching.
 */

export type MediaTreatment = 'none' | 'grayscale' | 'duotone' | 'contrast' | 'grain'

export type EntryPreset = 'none' | 'fade' | 'fade-up' | 'rise' | 'wipe' | 'scale-in'

export type MobileFallback = 'stack' | 'mediaOnly' | 'textOnly' | 'crop'

export type Typeface = 'serif' | 'sans' | 'mono'

export type Margin = 'none' | 'tight' | 'normal' | 'wide'

/** Nine-point grid, for placing text over a media bed. */
export type GridPos =
  | 'top-left'    | 'top-center'    | 'top-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

/**
 * `loop` is the GIF case: authored as a GIF, always delivered as a muted
 * looping video. See the media policy in the plan — we never ship image/gif.
 * `video` is real video, which may carry audio and therefore gets controls.
 */
export type MediaKind = 'image' | 'loop' | 'video'

export interface MediaRef {
  kind: MediaKind
  src: string
  /** First frame. Always rendered, so a page never flashes black while decoding. */
  poster?: string
  alt: string
  /** Normalised 0..1 focal point, mirrors Sanity's hotspot. */
  focal?: { x: number; y: number }
  treatment?: MediaTreatment
  /** Real video only — loops are always silent. */
  hasAudio?: boolean
}

/** Knobs every archetype carries. This is where the aesthetic actually lives. */
export interface PageBase {
  id: string
  ground?: string
  margin?: Margin
  typeScale?: number
  measure?: number
  tracking?: number
  typeface?: Typeface
  entry?: EntryPreset
  entryDuration?: number
  mobile?: MobileFallback
}

export interface Panel {
  media?: MediaRef
  text?: string[]
}

export type Page =
  | (PageBase & {
      archetype: 'titleCard'
      title: string
      subtitle?: string
      byline?: string
    })
  | (PageBase & {
      archetype: 'fullBleed'
      media: MediaRef
      overlay?: string
      overlayPosition?: GridPos
    })
  | (PageBase & {
      archetype: 'textPage'
      body: string[]
      align?: 'left' | 'center' | 'right'
    })
  | (PageBase & {
      archetype: 'diptych'
      /** Percentage width of the left panel, 20–80. */
      split: number
      left: Panel
      right: Panel
    })

export type Archetype = Page['archetype']

export interface Story {
  title: string
  byline: string
  pages: Page[]
}
