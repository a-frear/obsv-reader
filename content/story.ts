import type { Story } from '@/lib/types'

/**
 * Phase 1 placeholder content.
 *
 * Deliberately written rather than lorem-ipsum'd: you cannot judge a look
 * book's typography, measure, or rhythm against dummy text. Replaced wholesale
 * by Sanity in Phase 2 — the shape here is the shape the CMS will return.
 *
 * Media uses `placeholder:<label>` sources, which the Media component renders
 * as labelled blocks. No external assets and no network dependency yet.
 */
export const story: Story = {
  title: 'Observances',
  byline: 'placeholder text — for layout only',

  pages: [
    {
      id: 'cover',
      archetype: 'titleCard',
      title: 'Observances',
      subtitle: 'a short story',
      byline: 'placeholder edition',
      ground: '#0e0e0c',
      typeface: 'serif',
      entry: 'fade',
      entryDuration: 900,
    },
    {
      id: 'p1',
      archetype: 'fullBleed',
      media: {
        kind: 'loop',
        src: 'placeholder:harbour at 4am — loop',
        alt: 'A harbour before dawn, water moving slowly.',
        focal: { x: 0.5, y: 0.62 },
        treatment: 'grayscale',
      },
      overlay: 'She had never seen the sea.',
      overlayPosition: 'bottom-left',
      ground: '#0e0e0c',
      entry: 'fade-up',
    },
    {
      id: 'p2',
      archetype: 'textPage',
      body: [
        'She had never seen the sea, and so the word arrived to her as a sound long before it was ever a place — something her grandmother said at the end of sentences, the way other people said *eventually*.',
        'The tide came in regardless. That was the part nobody had thought to mention: that it would keep doing this, twice a day, with or without her, and had been doing it for the entire duration of her not having seen it.',
      ],
      align: 'left',
      ground: '#f4f1ea',
      typeface: 'serif',
      measure: 34,
      typeScale: 1.15,
      entry: 'fade',
    },
    {
      id: 'p3',
      archetype: 'diptych',
      split: 62,
      left: {
        media: {
          kind: 'loop',
          src: 'placeholder:gulls, 2s loop',
          alt: 'Gulls turning over a breakwater.',
          treatment: 'contrast',
        },
      },
      right: {
        text: [
          'Her grandmother had described it once as *a field that could not keep still*.',
          'This turned out to be exactly right, and no help at all.',
        ],
      },
      ground: '#0e0e0c',
      typeface: 'serif',
      mobile: 'stack',
      entry: 'rise',
    },
    {
      id: 'p4',
      archetype: 'fullBleed',
      media: {
        kind: 'image',
        src: 'placeholder:breakwater, midday',
        alt: 'A concrete breakwater under flat midday light.',
        focal: { x: 0.38, y: 0.5 },
      },
      ground: '#0e0e0c',
      entry: 'scale-in',
      entryDuration: 1200,
    },
    {
      id: 'p5',
      archetype: 'textPage',
      body: [
        'What she had not expected was the noise. Not the waves — she had been told about the waves — but everything underneath them: the shingle turning over, the rigging, the particular sound of a wet rope taking weight.',
        'She stood there long enough that the light changed twice.',
      ],
      align: 'left',
      ground: '#f4f1ea',
      typeface: 'serif',
      measure: 34,
      typeScale: 1.15,
      entry: 'fade',
    },
    {
      id: 'p6',
      archetype: 'diptych',
      split: 38,
      left: {
        text: ['Twice a day.', 'With or without her.'],
      },
      right: {
        media: {
          kind: 'video',
          src: 'placeholder:long take — 40s, sound',
          alt: 'A long static shot of the water at dusk.',
          treatment: 'grayscale',
          hasAudio: true,
        },
      },
      ground: '#15161a',
      typeface: 'serif',
      typeScale: 1.6,
      mobile: 'stack',
      entry: 'wipe',
    },
    {
      id: 'p7',
      archetype: 'fullBleed',
      media: {
        kind: 'loop',
        src: 'placeholder:tide going out — loop',
        alt: 'The tide withdrawing over flat sand.',
        focal: { x: 0.5, y: 0.7 },
        treatment: 'grain',
      },
      overlay: 'and had been doing it the whole time.',
      overlayPosition: 'middle-center',
      ground: '#0e0e0c',
      entry: 'fade-up',
      entryDuration: 1400,
    },
    {
      id: 'end',
      archetype: 'titleCard',
      title: 'end',
      subtitle: 'placeholder colophon',
      ground: '#0e0e0c',
      typeface: 'serif',
      entry: 'fade',
    },
  ],
}
