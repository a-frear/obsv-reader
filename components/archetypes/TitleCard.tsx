import type { Page } from '@/lib/types'

type P = Extract<Page, { archetype: 'titleCard' }>

export function TitleCard({ page }: { page: P }) {
  return (
    <div className="page__inner titlecard">
      <h1 className="entry">{page.title}</h1>
      {page.subtitle && <p className="sub entry">{page.subtitle}</p>}
      {page.byline && <p className="byline entry">{page.byline}</p>}
    </div>
  )
}
