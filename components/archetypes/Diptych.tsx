import type { Page, Panel } from '@/lib/types'
import { Media } from '@/components/reader/Media'
import { Prose } from './Prose'

type P = Extract<Page, { archetype: 'diptych' }>

function PanelView({ panel, active }: { panel: Panel; active: boolean }) {
  if (panel.media) {
    return (
      <div className="entry" style={{ width: '100%', height: '100%' }}>
        <Media media={panel.media} active={active} />
      </div>
    )
  }
  return panel.text ? <Prose body={panel.text} className="entry" /> : null
}

export function Diptych({ page, active }: { page: P; active: boolean }) {
  const split = Math.min(80, Math.max(20, page.split))
  return (
    <div className="page__inner diptych">
      <div className="diptych__panel" style={{ flex: `0 0 calc(${split}% - var(--margin) / 2)` }}>
        <PanelView panel={page.left} active={active} />
      </div>
      <div className="diptych__panel" style={{ flex: '1 1 0' }}>
        <PanelView panel={page.right} active={active} />
      </div>
    </div>
  )
}
