import type { ReactNode } from 'react'

/**
 * Minimal inline emphasis for Phase 1 placeholder copy (*word* -> <em>).
 * Phase 2 replaces this with Portable Text from Sanity; keeping it tiny now
 * means the sample prose reads correctly without pulling in a renderer.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).filter(Boolean).map((chunk, i) =>
    chunk.startsWith('*') && chunk.endsWith('*')
      ? <em key={i}>{chunk.slice(1, -1)}</em>
      : <span key={i}>{chunk}</span>
  )
}

export function Prose({ body, className }: { body: string[]; className?: string }) {
  return (
    <div className={['prose', className].filter(Boolean).join(' ')}>
      {body.map((p, i) => <p key={i}>{inline(p)}</p>)}
    </div>
  )
}
