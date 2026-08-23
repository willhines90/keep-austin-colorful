# Forking this for your city

The mechanism this site is built on is not specific to Austin. Several US states and cities have ordered removals of street art; in most of them the order reaches the **roadway** and stops at the kerb. Sidewalks, steps, benches, bike racks and lamp posts usually belong to the city.

If that is true where you are, most of this transfers.

## Before you touch the code

**Check that the distinction actually holds in your jurisdiction.** This is the whole argument. Read the order, find out who owns the sidewalk, and confirm somebody has done it successfully nearby. If the answer is no, a fork of this site will be confidently wrong, which is worse than nothing.

**Find your precedent.** Austin's version works because San Antonio had already done it: a real cost, a real date, a survived legal challenge. An abstract "cities can do this" is far weaker than "the city ninety miles away did it in March for $170,000."

**Decide who you are talking to.** This pack is written for council members and their staff, on the assumption they want to help and need a workable route. That assumption shapes every sentence. If your council is genuinely hostile, the tone here is wrong for you and you should rewrite it rather than inherit it.

## What to change, in order

Everything city-specific is in data objects near the top of `public/site.js`, in the page prose in `src/pages/*.html`, and in the `PAGES` array in `tools/build-pages.js` (titles, descriptions, nav order).

Note that `public/*.html` is generated. A pull request that edits it will be reverted by the next build.

| What | Where | Notes |
|---|---|---|
| Timeline | `TIMELINE` | Each entry takes a source key |
| Cities on the map | `CITIES` | Includes the corridor illustration spec |
| The asks | `ASKS` | Each becomes a sentence in the letter |
| Funding routes | `FUNDS` | |
| Objections and answers | `OBJS` | Published as `FAQPage` structured data |
| The action list | `TODOS` | Includes the copyable templates |
| Upcoming dates | `DATES` | Drives the "next up" banner and the calendar files |
| Calendar file contents | `ICS` | |
| Source links | `SRC` | Every claim should key into this |
| Stat row | `STATS` | Each figure carries its citation |
| Letter phrasings | `L`, `CONN_LINE`, `askSentence` | |
| ZIP fallback hints | `ZIP_HINT` | |
| Analytics | `ANALYTICS` | Off by default |

Then the harder pieces:

**The map.** `CITIES` positions are latitude and longitude projected into a 100 × 94.4 viewBox. If you swap states you need to regenerate the outline path and the pin coordinates together. There is a point-in-polygon test that will tell you when a pin lands outside the state, which is the failure you will actually hit.

**The district lookup.** Austin publishes council district boundaries as open data, and **the Cloudflare Worker** in `src/worker.js` queries it with a point from the US Census geocoder. You will need to change its `CENSUS`/`DISTRICTS` constants and the `/austin/i` check in `cleanAddress()`, and you will need a host that can run it. On purely static hosting the field degrades to the ZIP hint. The geocoder works anywhere in the US; the district layer does not. Find your city's equivalent, or delete the lookup and keep the ZIP hint.

**The illustrations.** The plan and street views are hand-drawn SVG generated in `planSVG()` and `streetSVG()`. The one thing to preserve is that the crosswalk bars are **identical** in the before and after states. That is the legal argument rendered as a picture, and there is a test asserting it.

## After any content change

```bash
npm run build
npm test
```

The first regenerates the pages from `src/pages/`, then the JSON-LD, sitemap, `robots.txt`, `llms.txt` and `_headers`. Skip it and you ship pages that do not match their own source. The second tells you if you broke something.

If you add or remove a page, it has to be declared in three places: `PAGES` in `tools/build-pages.js`, `SITEMAP` in `tools/build-meta.js`, and `PAGES` in `test/_boot.js`.

## What to keep

Two of the test suites encode decisions rather than mechanics, and they are the ones worth inheriting:

- **The tone assertions** in `6-brand-and-tone`. There is a list of phrases removed during a deliberate pass to make the site an invitation rather than an accusation. It is remarkably easy to undo that one word at a time.
- **The geometry assertions** in `3-map`. Pins inside the polygon, labels not colliding, the crosswalk bars matching.

## What we would ask

Not a licence condition, just a request.

Keep every factual claim linked to a source, and keep the tone one a public official could read without becoming defensive. This approach works because it is checkable and because it is easy to say yes to. A fork that gets the facts wrong, or that treats officials as opponents, makes the next person's job harder in every city.

If you build one, we would genuinely like to hear about it.
