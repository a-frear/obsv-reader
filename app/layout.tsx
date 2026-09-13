import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Down the shore',
  description: 'A short story, read as a sequence of composed pages.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
