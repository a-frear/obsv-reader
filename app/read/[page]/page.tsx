import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { story } from '@/content/story'
import { Pager } from '@/components/reader/Pager'

/**
 * The route is a deep-link entry point, not a per-page render: every page of
 * the story is in the DOM so the scroll-snap track has something to scroll
 * between (and so the full text is findable and selectable). This segment only
 * decides where the reader opens.
 */
export function generateStaticParams() {
  return story.pages.map((_, i) => ({ page: String(i + 1) }))
}

function parsePage(value: string): number | null {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1 || n > story.pages.length) return null
  return n
}

export async function generateMetadata({ params }: PageProps<'/read/[page]'>): Promise<Metadata> {
  const { page } = await params
  const n = parsePage(page)
  return {
    title: n ? `${story.title} — ${n}/${story.pages.length}` : story.title,
  }
}

export default async function ReadPage({ params }: PageProps<'/read/[page]'>) {
  const { page } = await params
  const n = parsePage(page)
  if (n === null) notFound()

  return <Pager story={story} initialIndex={n - 1} />
}
