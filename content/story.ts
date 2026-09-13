import type { Story } from '@/lib/types'

/**
 * Test content: opening excerpt, author's text verbatim.
 *
 * Paragraph breaks follow the source. Where a paragraph is split across pages
 * the sentences are unchanged and in order — the sequencing below is an
 * art-direction proposal, not an edit, and is the sort of decision that moves
 * into her hands in Phase 2.
 *
 * Media uses `placeholder:<label>` sources, labelled with what each shot would
 * actually be, and renders as labelled blocks until real assets land.
 */
export const story: Story = {
  // Placeholder — the author's own title replaces this.
  title: 'Untitled',
  byline: 'opening excerpt',

  pages: [
    {
      id: 'cover',
      archetype: 'titleCard',
      title: 'Untitled',
      subtitle: 'opening excerpt',
      byline: 'working draft',
      ground: '#0d1114',
      typeface: 'serif',
      entry: 'fade',
      entryDuration: 900,
    },

    {
      id: 'p1-thanksgiving',
      archetype: 'textPage',
      body: [
        'They took the jet skis out for Thanksgiving, a mid-morning break before they were expected at the Sebastian’s dad’s condo for turkey frying on the pool deck.',
      ],
      align: 'left',
      ground: '#f2efe7',
      typeface: 'serif',
      measure: 36,
      typeScale: 1.15,
      entry: 'fade',
    },

    {
      id: 'p2-wake',
      archetype: 'fullBleed',
      media: {
        kind: 'loop',
        src: 'placeholder:jet ski wake, GoPro under the jet — loop',
        alt: 'Water churning behind a jet ski, shot from below the jet.',
        focal: { x: 0.5, y: 0.58 },
        treatment: 'contrast',
      },
      ground: '#0d1114',
      entry: 'scale-in',
      entryDuration: 1200,
    },

    {
      id: 'p3-three-boys',
      archetype: 'textPage',
      body: [
        'Three boys, besties since just after birth, almost. Daycare together in the basement of a bank, preschool together in the basement of a church, and kindergarten off island after the one in the basement out here flooded. Homies since. Attached at the hip.',
      ],
      align: 'left',
      ground: '#f2efe7',
      typeface: 'serif',
      measure: 36,
      typeScale: 1.15,
      entry: 'fade',
    },

    {
      id: 'p4-gopro',
      archetype: 'diptych',
      split: 62,
      left: {
        media: {
          kind: 'loop',
          src: 'placeholder:trash-bagged foot, GoPro hinge — loop',
          alt: 'A foot wrapped in a taped plastic bag, resting near a GoPro on a hinge.',
          treatment: 'grain',
        },
      },
      right: {
        text: [
          'Two jet skis bobbing by in rhythm — Sebastian, with his foot enclosed in a roughly taped over plastic trash bag, backed Geb on one — he fiddled with a GoPro on an extended hinge beneath the stream of the jet, tightening its bolts.',
        ],
      },
      ground: '#0d1114',
      typeface: 'serif',
      measure: 30,
      mobile: 'stack',
      entry: 'rise',
    },

    {
      id: 'p5-julian',
      archetype: 'diptych',
      split: 42,
      left: {
        text: [
          'Julian sat side saddled on the other. They idled by the town’s best known tourist trap, their monument, a hollowed out blue whale, and within you can walk through a full reproduction of the cavities of its insides, Balooey the Blue Whale.',
        ],
      },
      right: {
        media: {
          kind: 'video',
          src: 'placeholder:Balooey from the water — 40s, sound',
          alt: 'The blue whale monument seen from the water.',
          treatment: 'none',
          hasAudio: true,
        },
      },
      ground: '#111a1e',
      typeface: 'serif',
      measure: 28,
      mobile: 'stack',
      entry: 'wipe',
    },

    {
      id: 'p6-balooey',
      archetype: 'fullBleed',
      media: {
        kind: 'image',
        src: 'placeholder:Balooey, mouth entrance',
        alt: 'The entrance to the hollowed-out blue whale monument.',
        focal: { x: 0.44, y: 0.52 },
        treatment: 'none',
      },
      // No overlay: the prose names him on the page before, so the image is
      // left to land on its own rather than repeating her line back.
      ground: '#0d1114',
      entry: 'fade-up',
      entryDuration: 1000,
    },

    {
      id: 'p7-dunes',
      archetype: 'textPage',
      body: [
        'The water was frigid but the sun burned hot — too hot for November was normal now, but the beaches were closed for the season while they fortified the dunes.',
      ],
      align: 'left',
      ground: '#f2efe7',
      typeface: 'serif',
      measure: 36,
      typeScale: 1.15,
      entry: 'fade',
    },

    {
      id: 'p8-ghosts',
      archetype: 'fullBleed',
      media: {
        kind: 'loop',
        src: 'placeholder:fortified dune line, empty beach — loop',
        alt: 'An empty beach behind a newly built dune line.',
        focal: { x: 0.5, y: 0.66 },
        treatment: 'grayscale',
      },
      overlay: 'Put simply, off season, the town was full of ghosts.',
      overlayPosition: 'middle-center',
      ground: '#0d1114',
      entry: 'fade-up',
      entryDuration: 1400,
    },

    {
      id: 'p9-write-offs',
      archetype: 'textPage',
      body: [
        'Most of these houses on the shoreline were tax breaks for neo-oligarchs and the class below them. Old money, new money, whoever can afford the insurance on a home in a beach town.',
        'Some of them preferred when the town would flood, more write offs to be had.',
      ],
      align: 'left',
      ground: '#f2efe7',
      typeface: 'serif',
      measure: 36,
      typeScale: 1.15,
      entry: 'fade',
    },

    {
      id: 'end',
      archetype: 'titleCard',
      title: 'end of excerpt',
      ground: '#0d1114',
      typeface: 'serif',
      entry: 'fade',
    },
  ],
}
