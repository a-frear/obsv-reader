/**
 * Password gate for the whole site.
 *
 * Runs at Netlify's edge, before anything is served. That matters: the story
 * text and the images live in the static files, so a password checked in the
 * browser would be no protection at all — the content would already have been
 * sent. Nothing here leaves the edge until the password matches.
 *
 * SETUP — the password is NOT in this file and must never be committed.
 * Set it in Netlify: Site configuration → Environment variables → add
 * SITE_PASSWORD. Redeploy after changing it.
 *
 * The username is ignored. She can type anything in that box.
 *
 * This file runs on Deno at the edge, not in the Next.js build, so it is
 * excluded from tsconfig.
 */

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const x = enc.encode(a)
  const y = enc.encode(b)
  if (x.length !== y.length) return false
  let diff = 0
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i]
  return diff === 0
}

const gate = async (request: Request): Promise<Response | undefined> => {
  // @ts-expect-error Deno is a runtime global at the edge.
  const expected: string | undefined = Deno.env.get('SITE_PASSWORD')

  // Fail closed. If the variable is missing the site stays shut rather than
  // silently publishing an unpublished draft to the open web.
  if (!expected) {
    return new Response(
      'This site is not configured yet. Set SITE_PASSWORD in the Netlify ' +
      'environment variables and redeploy.',
      { status: 503, headers: { 'cache-control': 'no-store' } },
    )
  }

  const header = request.headers.get('authorization')

  if (header?.startsWith('Basic ')) {
    try {
      // atob yields one character per byte, so a UTF-8 password comes back as
      // mojibake and never matches. Decode the bytes properly — otherwise a
      // password with an accent or a dash in it locks everyone out silently.
      const bytes = Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
      const decoded = new TextDecoder().decode(bytes)
      // Everything after the first colon is the password; the username is
      // whatever she felt like typing.
      const supplied = decoded.slice(decoded.indexOf(':') + 1)
      if (safeEqual(supplied, expected)) {
        return undefined // let the request through to the site
      }
    } catch {
      // Malformed header; fall through to the challenge below.
    }
  }

  return new Response('Not authorised.', {
    status: 401,
    headers: {
      'www-authenticate': 'Basic realm="Down the shore", charset="UTF-8"',
      'cache-control': 'no-store',
    },
  })
}

export default gate

export const config = {
  // Everything, including /_next/* — the JavaScript bundle contains the story
  // text, so gating only the pages would leak it.
  path: '/*',
}
