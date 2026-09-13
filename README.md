# OBSV Studies Reader Prototype

A short story you read by turning pages, with pictures and video in it.

Netlify prototype link: https://obsv-reader.netlify.app/read/1

---

## Page templates

Every page is a template. You pick the type, then change how it looks with the
dials further down.

In the drawings below, `░` is a picture or a clip, and the lines are text.

**Title Card** — built

```
┌──────────────────────┐
│                      │
│      ━━━━━━━━━       │
│        ──────        │
│                      │
└──────────────────────┘
```

The title, or a chapter break, on its own.

**Full Bleed** — built

```
┌──────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────┘
```

One picture or clip filling the whole page. You can put a line of text on top.

**Text Page** — built

```
┌──────────────────────┐
│  ─────────────       │
│  ─────────────       │
│  ─────────────       │
│  ────────            │
└──────────────────────┘
```

Just words.

**Diptych** — built

```
┌──────────────────────┐
│░░░░░░░░░░░░  ──────  │
│░░░░░░░░░░░░  ──────  │
│░░░░░░░░░░░░  ────    │
│░░░░░░░░░░░░          │
└──────────────────────┘
```

Two panels side by side. Each one can be a picture or text. You set where the
split goes.

**Plate** — not yet

```
┌──────────────────────┐
│                      │
│     ░░░░░░░░░░░      │
│     ░░░░░░░░░░░      │
│                      │
└──────────────────────┘
```

A small picture on a big field of colour.

**Triptych** — not yet

```
┌──────────────────────┐
│ ░░░░░░ ░░░░░░ ░░░░░░ │
│ ░░░░░░ ░░░░░░ ░░░░░░ │
│ ░░░░░░ ░░░░░░ ░░░░░░ │
│ ░░░░░░ ░░░░░░ ░░░░░░ │
└──────────────────────┘
```

Three panels across.

**Text Over Image** — not yet

```
┌──────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
│░░━━━━━━━━━━━━░░░░░░░░│
│░░────────░░░░░░░░░░░░│
└──────────────────────┘
```

Words on top of a picture. You pick which of nine spots they sit in.

**Pull Quote** — not yet

```
┌──────────────────────┐
│                      │
│  ━━━━━━━━━━━━━━━━━━  │
│  ━━━━━━━━━━━         │
│                      │
└──────────────────────┘
```

One line, very big, on its own.

**Sequence** — not yet

```
┌──────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░ ● ○ ○ ░░░░░░░░│
└──────────────────────┘
```

A few pictures on one page. The reader clicks through them.

**Mosaic** — not yet

```
┌──────────────────────┐
│ ░░░░░ ░░░░░ ░░░░░    │
│ ░░░░░ ░░░░░ ░░░░░    │
│ ░░░░░ ░░░░░ ░░░░░    │
│ ░░░░░ ░░░░░ ░░░░░    │
└──────────────────────┘
```

A grid of small images or clips all playing at once.

**Colophon** — not yet

```
┌──────────────────────┐
│                      │
│                      │
│        ──────        │
│        ──────        │
└──────────────────────┘
```

The end of the book. Credits, thanks, date.

---

## Dials

Every template has the same dials. This is where your look comes from. Two Text
Pages with different settings can feel like different books.

| Dial | What it does |
| --- | --- |
| **Background** | The colour behind the page. Text colour changes so you can still read it. |
| **Typeface** | Picked from a short list we choose together. |
| **Text size** | Bigger or smaller, page by page. |
| **Column width** | How wide the text runs before it wraps. Narrow and tall, or wide and short. |
| **Letter spacing** | Tighter or looser. |
| **Margins** | How much empty space sits around the page. From none to a lot. |
| **How the page arrives** | Fade, rise, drift, or nothing. And how slowly it happens. |
| **Picture treatment** | Black and white, more contrast, duotone, or grain. Your original file stays as it is. |
| **Focal point** | Drag a dot onto the important part of a photo. If the photo gets cropped, that part stays. |
| **On a phone** | What a two-panel page turns into on a small screen. Stacked, or just the picture, or just the words. |

---

## Pictures and video

Supports images, gifs, and videos. Videos with sound get a play button instead of starting on
their own.


---

## Reading it

Arrow keys turn the page. So does scrolling, swiping, or clicking the edges.
Every page has its own web address, so you can link someone straight to page 7.

---

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

The story content is in `content/story.ts` until the editor is built.
