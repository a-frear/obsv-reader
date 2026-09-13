import type { Page } from '@/lib/types'
import { Prose } from './Prose'

type P = Extract<Page, { archetype: 'textPage' }>

export function TextPage({ page }: { page: P }) {
  return (
    <div className="page__inner textpage" data-align={page.align ?? 'left'}>
      <Prose body={page.body} className="entry" />
    </div>
  )
}
