# Keep Austin Colorful

[![CI](https://github.com/willhines90/keep-austin-colorful/actions/workflows/ci.yml/badge.svg)](https://github.com/willhines90/keep-austin-colorful/actions/workflows/ci.yml)

An advocacy pack for putting the color back on 4th &amp; Colorado in Austin, Texas.

The name is a play on Keep Austin Weird. The color in it is paint.

**Live:** https://keepaustincolorful.com

---

## What this is

In October 2025 the Texas governor ordered the state transportation department to withhold road funding from any city that kept "political" street art. Austin's rainbow crosswalk at West 4th and Colorado, installed in 2021 in the heart of the city's LGBTQ+ district, came up on 20–21 July 2026. Every Texas city that applied for an exemption was denied.

San Antonio, facing the same order, painted its **sidewalks** rainbow instead. Two blocks of North Main Avenue, roughly $170,000, dedicated in March 2026, still there. It survived a legal challenge and cost the city no road funding. And it needed no council vote, because that corridor already held Pride Cultural Heritage District status.

The state's order reaches the road. Sidewalks belong to the city. This site explains that distinction, shows what four other Texas cities did, and helps a resident write to their council member in about five minutes.

## Running it

Five pages that share one stylesheet and one script. No framework, no runtime dependency, plain ES5.

**`public/*.html` is generated.** Page bodies are edited in `src/pages/*.html` and wrapped in shared chrome by `tools/build-pages.js`. Editing a file in `public/` works right up until the next build silently reverts it.

```bash
npm install
npm run build    # pages, then metadata
npm test
```

```bash
npm run dev     # serves ./public on http://localhost:8000
```

Only `public/` (the site) and `src/worker.js` (the district lookup route) are deployed. The page sources, tools, tests, docs and image sources live alongside them in the repo but never ship.

## Design system

Two families and one scale, both enforced by tests rather than convention.

- **Poppins** for display, **Figtree** for reading. Loaded from Google Fonts with the system stack as fallback.
- Nine font-size tokens, four weights, an 11-step space scale, five radii, three shadows, three motion durations. A test fails if a raw `rem` size appears in the stylesheet, because a scale nobody follows is not a scale.
- Every section carries a hairline of flag color along its top, cycling through the six, so the page reads as one continuous rainbow rather than a stack of white boxes.
- Two sections are dark: the one that explains the mechanism, and the closing contact block. Every color pair on them clears WCAG AA, verified in a real browser rather than in jsdom.

## Analytics

Off by default; beyond Google Fonts the site makes no third-party requests until you switch something on. **Cloudflare Web Analytics** is the chosen provider: cookieless, unsampled, no consent banner. It is wired and waiting for a token. See [ANALYTICS.md](ANALYTICS.md), including why edge injection cannot work on a `workers.dev` URL and why Vercel Analytics cannot work on a non-Vercel host.

## Metadata is generated, not maintained

`npm run build` generates the five pages from `src/pages/`, then derives the
JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt` and `_headers` from the data in
`public/site.js`. Run it after any content edit and commit the result;
`npm run deploy` runs it for you, and CI fails the PR if you forget.

There is no CSP script hash to keep in sync any more: there is no inline script,
so `script-src 'self'` covers it.

The structured data matters more than usual here. The objection cards are
published as a `FAQPage` and the calendar as `Event` records, which is how
answer engines and AI summarizers pick up a small site with no domain authority.
`llms.txt` carries the verified figures and explicitly asks summarizers to
preserve the non-adversarial framing.

## The district lookup

Typing an address looks up the writer's council district using two public endpoints, neither of which needs a key:

1. The **US Census geocoder** turns the address into a coordinate.
2. **Austin's own open data layer** (`w3v2-cj58`) says which council district contains that point.

Both calls happen in a Cloudflare Worker (`src/worker.js`), not in the browser, and the page makes a single same-origin request to `/api/district`.

That indirection is not architectural taste. The Census geocoder answers server-to-server requests perfectly well but returns **503 to anything sending a browser `Origin` header** — verified on 15 August 2026, identical URL, same minute, 200 from a server and 503 from a page. Called directly from the browser the lookup failed silently on every visit and quietly degraded to the ZIP guess. Moving it server-side also means the page reaches no third-party host at all, so `connect-src` in the CSP is `'self'`.

It remains strictly progressive enhancement. Any failure times out after eight seconds and falls back to a ZIP code hint that narrows the options but never picks one. The form always works without it.

Once a district is known, the page shows that member's direct number, which is how a reader gets from "I care about this" to a phone call in one step.

## Tests

```bash
npm install
npm test
```

404 checks across nine suites (about 50 seconds), run on every push by CI. They boot the real pages in jsdom through the shared fixture in `test/_boot.js` and drive the real interface: suite 3 boots the background page, suites 2, 5 and 8 the action page, suites 6 and 7 all five. See [test/README.md](test/README.md) for what each one covers and why a few of them encode decisions rather than mechanics.

## Deploying

Cloudflare Workers. See [DEPLOY.md](DEPLOY.md). Short version:

```bash
npm run deploy      # build:pages + build:meta, then wrangler deploy
```

`wrangler.jsonc` ships `public/` as static assets and `src/worker.js` as the
`/api/district` route. Nothing else in the repo is uploaded.

To move the site to a different domain:

```bash
./set-domain.sh your-domain.org
```

That edits `DEFAULT_DOMAIN` in `tools/build-pages.js` and rebuilds, which rewrites the canonical and Open Graph tags on all five pages and regenerates the sitemap, robots.txt and llms.txt to match.

## Contributing and forking

- [CONTRIBUTING.md](CONTRIBUTING.md) — how to run it, and the two house rules for copy
- [FORKING.md](FORKING.md) — adapting it for another city, and what to check before you do
- [SECURITY.md](SECURITY.md) — what the site does and does not send anywhere
- [PHOTO-REQUESTS.md](PHOTO-REQUESTS.md) — four drafted licence requests, ready to send
- [PHOTOS.md](PHOTOS.md) — the four photographs worth having, and where they can legally come from
- [ANALYTICS.md](ANALYTICS.md) — off by default; how to switch it on
- [LOGO-BRIEF.md](LOGO-BRIEF.md) — the mark, and the unsolved problem of
  incorporating the trans flag, with a generation prompt for exploring it
- [DEPLOY.md](DEPLOY.md) — Cloudflare Workers, and why the host has to run the worker

## Forking this for your city

The structure generalizes. Most of what you'd change lives in clearly-marked data objects near the top of `public/site.js`, and the page prose in `src/pages/*.html`:

| What | Where |
|---|---|
| Timeline entries | `TIMELINE` |
| Cities on the map and their corridor illustrations | `CITIES` |
| The asks people can select | `ASKS` |
| Funding routes | `FUNDS` |
| Objections and answers | `OBJS` |
| The action list and its templates | `TODOS` |
| Upcoming dates, which drive the "next up" banner | `DATES` |
| Calendar file contents | `ICS` |
| ZIP code fallback hints | `ZIP_HINT` |
| Address to district lookup | `lookupDistrict()` |
| Letter phrasings, one pool per slot | `L`, `CONN_LINE`, `askSentence` |
| Source links | `SRC` |
| The stat row, each figure with its citation | `STATS` |
| The three-beat momentum strip | `MOMENTUM` |
| Photographs, empty until you have one | `PHOTOS` |
| Analytics configuration | `ANALYTICS` |
| Page titles, descriptions and nav order | `PAGES` in `tools/build-pages.js` |
| The prose on each page | `src/pages/*.html` |

Map pin positions are projected latitude/longitude in a 100 × 94.4 viewBox. If you swap in a different state, you'll need to regenerate the outline path and the pin coordinates together.

`og-source.svg` is the editable source for the share image.

> **The share image lags the headline.** `og-source.svg` carries the current
> wording; `public/og.png` still reads "Let's put the color back on 4th St."
> Regenerate it with a real SVG renderer (`rsvg-convert -w 1200 -h 630
> og-source.svg -o public/og.png`, or open the SVG in a browser and export).
> ImageMagick's `convert` mangles the negative letter-spacing on the headline,
> so don't use it.

## A note on tone

This pack works because it asks for something a city can lawfully say yes to, and because every factual claim links to its source. If you adapt it, please keep both of those true. The moment it reads as an accusation rather than an invitation, it gets easier to ignore.

## Credits and sources

Reporting drawn from the Texas Tribune, TPR, the San Antonio Report, KENS5, KUT, Axios Austin and KVUE. Council dates from the City of Austin's published 2026 calendar. Every claim on the site links to the piece it came from.

Not affiliated with the City of Austin. Not legal advice.

## What this is for, and a request

This was built to help a neighborhood ask its city for something specific and lawful. It works because every claim links to a source, and because it reads as an invitation rather than an accusation.

If you fork it for your own city, please keep both of those. Check your facts and cite them, and write to your council as though they want to help, because most of the time they do. An advocacy tool that gets the facts wrong, or that treats officials as opponents, makes the next person's job harder.

## License

- **Code** — [Apache License 2.0](LICENSE). Note section 6: this does not grant rights to the project's name or wordmark, so please run your fork under its own name.
- **Written content** — [CC BY-SA 4.0](LICENSE-CONTENT). Adapt it freely, credit the source, and keep your version open under the same terms so it stays available to the city after yours.

Take it, adapt it, point it at your own corner.
