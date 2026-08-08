# Deploying Keep Austin Colorful

Everything is in this folder. No build step, no dependencies, no framework. `index.html` is one self-contained file, 132KB, with all CSS, JavaScript and artwork inlined.

---

## The layout

Only `public/` is deployed. Everything else — tests, docs, the share-image source — stays in the repo but never ships.

```
public/          index.html, og.png, robots.txt, _headers   <- this is the site
wrangler.jsonc   points Cloudflare at ./public
test/            258 checks, not deployed
```

This matters. The first Cloudflare build failed because Wrangler defaulted its
asset directory to the repo root, and the build machine had just run
`bun install`, so it tried to upload jsdom's 122 MiB `workerd` binary as a
static asset. Keeping the deployable files in their own directory makes that
impossible on any host.

## Cloudflare

Connect the repo at [pages.cloudflare.com](https://pages.cloudflare.com). With
`wrangler.jsonc` present, Cloudflare reads the asset directory from it. Leave
the build command **empty** — `index.html` is the finished artifact, there is
nothing to build.

To deploy from your machine instead:

```bash
npx wrangler deploy
```

## Fastest route: Vercel

```bash
cd deploy
npx vercel
```

It will ask you to log in, then a few setup questions. Accept the defaults; when it asks for the output directory, leave it blank. You'll get a preview URL in about twenty seconds.

When you're happy with it:

```bash
npx vercel --prod
```

That gives you `keep-austin-colorful.vercel.app` or similar.

### One thing to do straight after

Social previews need an **absolute** URL for the share image. Right now it's relative, which Vercel and Netlify both resolve fine but some scrapers (notably older Slack and a few mail clients) do not. Once you know your domain:

```bash
sed -i '' 's|content="/og.png"|content="https://YOUR-DOMAIN.vercel.app/og.png"|g' index.html
npx vercel --prod
```

Then paste the URL into [opengraph.xyz](https://www.opengraph.xyz) to confirm the card renders.

---

## Alternatives, all equally fine

**Netlify** — drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop). No CLI, no account needed to start. `netlify.toml` is already here.

**Cloudflare Pages** — connect a repo, or `npx wrangler pages deploy .`

**GitHub Pages** — push the folder contents to a repo, then Settings → Pages → deploy from branch. Note that Pages serves from a subpath unless you use a custom domain, which breaks the `/og.png` reference. Use a relative `og.png` instead if you go this route.

**Surge** — `npx surge .` is the shortest path of all if you just want a link in thirty seconds.

---

## What changed from the version you've been demoing

**The Cowork manifest is gone.** It was metadata for the sidebar and means nothing on the open web.

**The letter builder now runs on its template.** Inside Cowork it drafts through a live model; on a public site there's no model behind it, so it assembles the letter from your selections and your own words. This was always the fallback path and it's been tested against model failure, timeout and junk-response cases, so it isn't a degraded experience so much as the deterministic one. The page now says so plainly under the letter form: *"Assembled from your answers on this page. Nothing you type is sent anywhere."*

That last sentence is worth keeping. It's true, it's a privacy guarantee most advocacy sites can't make, and it removes any question about what happens to someone's name and address.

**Metadata added** — description, Open Graph, Twitter card, robots, and a 1200×630 share image.

**Security headers** are set in `vercel.json` and `netlify.toml`. Nothing exotic, just the sensible defaults.

---

## If you want live drafting on the public site

It's possible, and it's a real decision rather than a switch.

You'd add a serverless function (`api/draft.js` on Vercel) holding an Anthropic API key server-side, and point the page's `askClaude` call at it. Roughly thirty lines.

The reasons to think before doing it:

- **You pay per letter drafted.** Pennies each, but a site that gets shared widely, or scraped, could run up a bill with no ceiling.
- **It needs abuse protection.** Rate limiting by IP at minimum, or one bored person can drain the key.
- **It's the part most likely to break on stage or in front of a reporter.** The template path always works.

My honest read: ship the template version now, get it in front of people, and only add the model if you find that the template letters are actually holding anyone back. They probably won't. The template already assembles from the reader's own selections and their own sentence, which is the part that makes a letter land.

Say the word and I'll write the function.

---

## Before you send it around

- [ ] Open it on a phone. The whole thing is responsive but you should see it yourself.
- [ ] Click through all four tabs, drag the before/after slider, tick something in the action list, reload, confirm your progress persisted.
- [ ] Generate a letter and read it end to end.
- [ ] Check the share card at [opengraph.xyz](https://www.opengraph.xyz).
- [ ] Reread the two dates: **12–14 August** budget adoption, **27 August** council meeting. If either slips, they're in `index.html` in the `ICS` object and the "Dates that matter" section.

---

## Keeping it honest

The strongest thing about this pack is that every factual claim links to its source and nothing on it asks anyone to break a law. If you edit the copy, keep both of those true. The moment it reads like a protest poster rather than a civic argument, it hands the other side the framing.
