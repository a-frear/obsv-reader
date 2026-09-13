import type { Page } from '@/lib/types'
import { TitleCard } from './TitleCard'
import { FullBleed } from './FullBleed'
import { TextPage } from './TextPage'
import { Diptych } from './Diptych'

/**
 * The single registration point for archetypes.
 *
 * Adding an archetype is: one component file, one `case` here, one object type
 * in the Sanity schema. Nothing else in the reader needs to know about it.
 */
export function renderArchetype(page: Page, active: boolean) {
  switch (page.archetype) {
    case 'titleCard': return <TitleCard page={page} />
    case 'fullBleed': return <FullBleed page={page} active={active} />
    case 'textPage':  return <TextPage page={page} />
    case 'diptych':   return <Diptych page={page} active={active} />
  }
}
