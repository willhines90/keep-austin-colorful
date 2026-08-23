# Tests

```bash
npm install     # jsdom, once
npm test
```

Each suite loads *the page it is about* through the shared fixture `test/_boot.js`, which splices `site.css` and `site.js` back into the real HTML, then drives the real interface and asserts on what actually happens.

`test/_boot.js` is the file to read first. Its `PAGES` array is the canonical page list for the suites, and its comment about `$$` in string replacements documents a footgun that cost an hour once. There is no mocking of the page itself.

| Suite | Covers |
|---|---|
| `1-core` | Pages boot without errors, the shared nav, timeline, map selection, playbook, action tracker, letter generation end to end |
| `2-letter-builder` | The inference path and every way it can fail: rejection, junk response, empty string, a bare number, a hang, and a missing `matchMedia`. Also localStorage persistence and corruption |
| `3-map` | Texas outline point count, every pin verified inside the polygon, label collision and overflow, corridor illustrations per city, sortable table, pin focus states |
| `4-hero-and-form` | Plan and street views, the before/after slider, connection chips, ZIP to council district detection, inline source links |
| `5-actions` | Twelve actions in three tiers, copyable templates, the quick filter, progress ring and category counters |
| `6-brand-and-tone` | Brand lockup and favicon, the type system, US spelling, no em dashes, and a list of phrases the tone pass removed that must not return |
| `7-links-and-a11y` | External links open or fall back to copying, keyboard reach on every control, skip link, touch targets |
| `9-seo-and-hardening` | JSON-LD validity and coverage, sitemap coverage across all five pages, llms.txt, 404, that no inline script survives and the CSP is `script-src 'self'` with no leftover hash, per-page canonicals and distinct titles, the press kit, and that the old tab hashes still redirect |
| `8-letter-variation` | Two writers never get the same letter, one writer always gets the same one, tone and connection chips actually change the text, and no form-letter tells |

## Why these exist

The site is five generated pages sharing one stylesheet and one script, with a lot of interdependent copy. The tone pass alone rewrote about forty strings, and a stray apostrophe in one of them broke the whole page silently — the tests caught it in seconds.

A few assertions encode decisions rather than mechanics, and those are the valuable ones:

- **The crosswalk bars must be pixel-identical** in the before and after illustrations, in both plan and street view. That distinction *is* the legal argument, and an innocent-looking edit could erase it.
- **Every map pin must fall inside the Texas polygon**, so no city can drift into the Gulf when coordinates get adjusted.
- **The white ring around a pin must always be larger than the dot**, at every interaction state. It wasn't once, and the selected state looked broken.
- **Two people must not get the same letter.** Council offices log identical form letters as a single contact, so variation is not cosmetic. The suite generates letters for several writers and asserts they differ, while asserting one writer gets a stable letter each time.
- **A list of removed phrases** — "has not tried", "chosen not to", "out-prided" and others — must not reappear. The site's persuasive strategy depends on being an invitation rather than an accusation, and that is easy to undo one word at a time.

**If suite 9 fails after you edit `src/pages/*.html` or `public/site.js`**, run
`npm run build`. The pages, the JSON-LD, the sitemap, `llms.txt` and `_headers`
are all generated, so they go stale the moment the source changes. The suite
failing is the mechanism working.

If you fork this for another city, the tone and geometry assertions are the ones to keep.
