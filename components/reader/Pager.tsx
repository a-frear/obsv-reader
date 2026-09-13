'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Story } from '@/lib/types'
import { inkFor, pageStyle } from '@/lib/tokens'
import { renderArchetype } from '@/components/archetypes'

/** How long to ignore further wheel events after one gesture advances a page. */
const WHEEL_LOCK_MS = 620
/** Below this, a wheel event is drift rather than intent. */
const WHEEL_THRESHOLD = 8
/** Page-turn duration. Becomes a theme knob in Phase 2. */
const TURN_MS = 520

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Pager({ story, initialIndex }: { story: Story; initialIndex: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const wheelLock = useRef(false)
  const turn = useRef<number | null>(null)
  const turnTarget = useRef<number | null>(null)
  const ready = useRef(false)
  const [index, setIndex] = useState(initialIndex)

  const total = story.pages.length

  /**
   * Abandon an in-flight turn where it stands and hand snapping back — used
   * when a real gesture takes over, so the reader doesn't fight the user.
   */
  const abandonTurn = useCallback(() => {
    if (turn.current) cancelAnimationFrame(turn.current)
    turn.current = null
    turnTarget.current = null
    if (trackRef.current) trackRef.current.style.scrollSnapType = ''
  }, [])

  /**
   * Complete an in-flight turn immediately.
   *
   * rAF does not run in a hidden tab, so a turn interrupted by the reader
   * switching away would otherwise stall mid-page and leave snapping disabled
   * behind it. On the way out, land on the target and restore snap.
   */
  const finishTurn = useCallback(() => {
    const track = trackRef.current
    if (turn.current) cancelAnimationFrame(turn.current)
    turn.current = null
    if (track) {
      if (turnTarget.current !== null) track.scrollLeft = turnTarget.current
      track.style.scrollSnapType = ''
    }
    turnTarget.current = null
  }, [])

  const chromeInk = inkFor(story.pages[index]?.ground)

  /**
   * Read the live page index out of the DOM rather than from React state.
   * Event listeners are bound once, so a captured `index` would go stale —
   * and for a uniform-width snap track this rounding is exact.
   */
  const currentFromDom = useCallback(() => {
    const track = trackRef.current
    if (!track?.clientWidth) return 0
    return Math.round(track.scrollLeft / track.clientWidth)
  }, [])

  /**
   * Programmatic navigation.
   *
   * `scroll-snap-type: x mandatory` cancels *any* programmatic scroll in
   * Chrome — scrollTo, scrollIntoView and CSS scroll-behavior all move zero
   * pixels while it is on. Lifting snap and using native smooth scrolling
   * turned out to be a race (a stray `scrollend` restores snap mid-animation
   * and kills the scroll), so the turn is animated here instead.
   *
   * That also makes the page-turn curve ours rather than the browser's, which
   * is the right place for it: duration and easing are aesthetic decisions on
   * a piece like this, and they become theme knobs in Phase 2.
   *
   * Snap stays on for touch and trackpad — the case it actually exists for.
   */
  const goTo = useCallback((n: number) => {
    const track = trackRef.current
    if (!track?.clientWidth) return

    const target = Math.max(0, Math.min(total - 1, n)) * track.clientWidth
    const start = track.scrollLeft
    const delta = target - start
    if (Math.abs(delta) < 1) return

    abandonTurn()
    turnTarget.current = target

    if (prefersReducedMotion() || document.hidden) {
      track.scrollLeft = target
      turnTarget.current = null
      return
    }

    track.style.scrollSnapType = 'none'
    const t0 = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / TURN_MS)
      track.scrollLeft = start + delta * easeInOutCubic(t)
      if (t < 1) {
        turn.current = requestAnimationFrame(step)
        return
      }
      turn.current = null
      turnTarget.current = null
      track.scrollLeft = target        // land exactly on the page boundary
      track.style.scrollSnapType = ''  // hand snapping back to touch/trackpad
    }
    turn.current = requestAnimationFrame(step)
  }, [total, abandonTurn])

  // A real gesture always wins over an in-flight turn, or the two fight for
  // scrollLeft and the reader feels like it is sticking.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const yield_ = () => abandonTurn()
    const onVisibility = () => { if (document.hidden) finishTurn() }
    track.addEventListener('pointerdown', yield_, { passive: true })
    track.addEventListener('touchstart', yield_, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      track.removeEventListener('pointerdown', yield_)
      track.removeEventListener('touchstart', yield_)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [abandonTurn, finishTurn])

  // Jump to the deep-linked page before first paint, and stop the browser
  // from restoring a scroll position of its own on top of it.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    track.scrollLeft = initialIndex * track.clientWidth
    ready.current = true

    // Take focus into the reader, or the first arrow key goes nowhere.
    // On a fresh load focus sits in the browser's own UI rather than the
    // document — after dismissing a password dialog especially — and the
    // keydown listener is on `window`, so it never sees that first press.
    // preventScroll matters: focusing a scroll container otherwise yanks it
    // back to the start and undoes the deep link above.
    track.focus({ preventScroll: true })
  }, [initialIndex])

  // Track the current page off the scroll position, throttled to a frame.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const next = currentFromDom()
        setIndex((prev) => (prev === next ? prev : next))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [currentFromDom])

  // Keep the URL honest so any page is linkable and the back button works.
  useEffect(() => {
    if (!ready.current) return
    const next = `/read/${index + 1}`
    if (window.location.pathname !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [index])

  // Vertical wheel advances a page; horizontal (trackpad swipe) is left to
  // the native snap scroller, which already does it better than we would.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      if (wheelLock.current || Math.abs(e.deltaY) < WHEEL_THRESHOLD) return
      wheelLock.current = true
      goTo(currentFromDom() + (e.deltaY > 0 ? 1 : -1))
      window.setTimeout(() => { wheelLock.current = false }, WHEEL_LOCK_MS)
    }
    track.addEventListener('wheel', onWheel, { passive: false })
    return () => track.removeEventListener('wheel', onWheel)
  }, [goTo, currentFromDom])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.isContentEditable || (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      const here = currentFromDom()
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown': e.preventDefault(); goTo(here + 1); break
        case 'ArrowLeft':
        case 'PageUp': e.preventDefault(); goTo(here - 1); break
        case ' ': e.preventDefault(); goTo(here + (e.shiftKey ? -1 : 1)); break
        case 'Home': e.preventDefault(); goTo(0); break
        case 'End': e.preventDefault(); goTo(total - 1); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, currentFromDom, total])

  // A resize changes the page width, so the same scrollLeft would land
  // mid-spread. Re-anchor to the page we were on.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let lastWidth = track.clientWidth
    const onResize = () => {
      const width = track.clientWidth
      if (!width || width === lastWidth) return
      const page = Math.round(track.scrollLeft / lastWidth)
      lastWidth = width
      track.scrollTo({ left: page * width, behavior: 'auto' })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <div
        ref={trackRef}
        className="track"
        role="region"
        aria-roledescription="reader"
        aria-label={story.title}
        tabIndex={0}
      >
        {story.pages.map((page, i) => (
          <section
            key={page.id}
            id={`page-${i + 1}`}
            className="page"
            style={pageStyle(page)}
            data-entry={page.entry ?? 'fade'}
            data-active={i === index}
            data-mobile={page.mobile ?? 'stack'}
            aria-roledescription="page"
            aria-label={`Page ${i + 1} of ${total}`}
          >
            {renderArchetype(page, i === index)}
          </section>
        ))}
      </div>

      {/*
        The chrome is fixed outside the track, so it can't inherit a page's ink
        the way archetype content does. Hand it the current page's ink, or it
        goes cream-on-cream the moment a light-ground page comes up.
      */}
      <div
        className="chrome"
        style={{
          '--ink': chromeInk,
          '--ink-dim': `color-mix(in srgb, ${chromeInk} 55%, transparent)`,
        } as CSSProperties}
      >
        <div className="progress" style={{ width: `${((index + 1) / total) * 100}%` }} />
        <p className="counter" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <button
          className="edge-nav"
          data-side="prev"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous page"
        >
          <Chevron dir="left" />
        </button>
        <button
          className="edge-nav"
          data-side="next"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          aria-label="Next page"
        >
          <Chevron dir="right" />
        </button>
      </div>
    </>
  )
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  )
}
