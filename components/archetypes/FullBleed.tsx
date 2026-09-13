import type { Page } from '@/lib/types'
import { Media } from '@/components/reader/Media'

type P = Extract<Page, { archetype: 'fullBleed' }>

export function FullBleed({ page, active }: { page: P; active: boolean }) {
  return (
    <div data-pos={page.overlayPosition ?? 'bottom-left'} style={{ position: 'absolute', inset: 0 }}>
      <div className="fullbleed__media entry">
        <Media media={page.media} active={active} />
      </div>
      {page.overlay && (
        <div className="fullbleed__overlay">
          <p className="entry">{page.overlay}</p>
        </div>
      )}
    </div>
  )
}
