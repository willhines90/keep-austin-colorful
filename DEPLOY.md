# Deploying

Live at **https://keepaustincolorful.com**, on Cloudflare Workers.

```bash
npm install
npm run build      # generates the pages, then the metadata
npm test           # 404 checks
npx wrangler deploy
```

`npm run deploy` does the build and the deploy in one step.

## What ships

```
public/            the site: five pages, site.css, site.js, og.png,
                   favicon.svg, robots.txt, sitemap.xml, llms.txt,
                   _headers, 404.html
src/worker.js      the /api/district route
```

Everything else — `src/pages/`, `tools/`, `test/`, the docs, `node_modules` —
stays out of the upload. `wrangler.jsonc` pins `assets.directory` to `./public`
and `main` to `src/worker.js`.

That pinning matters. The first deploy failed because Wrangler defaulted to the
repo root and tried to upload jsdom's 122 MiB `workerd` binary as a static
asset, against a 25 MiB limit.

## The build is not optional

`public/*.html` is **generated** from `src/pages/*.html` by
`tools/build-pages.js`. Editing a file in `public/` works until the next build
silently reverts it. Edit `src/pages/`, then run `npm run build`.

`tools/build-meta.js` then derives the JSON-LD, `sitemap.xml`, `robots.txt`,
`llms.txt` and `_headers` from the data in `public/site.js`, so the metadata
cannot drift from the page. CI fails the PR if the generated files are stale.

## Why Cloudflare specifically

The address lookup needs `/api/district`. The US Census geocoder answers
servers but returns 503 to anything sending a browser `Origin` header, so the
geocode has to happen server-side.

Netlify, GitHub Pages, Surge and plain object storage will all host the five
pages perfectly well, and the site will look completely fine. But the address
field will silently fall back to the ZIP-code hint on every visit, because
there is nothing serving that route. If you fork this and host it statically,
either accept that or port the worker to your host's equivalent.

## Changing the domain

```bash
./set-domain.sh your-domain.org
```

That edits `DEFAULT_DOMAIN` in `tools/build-pages.js` and rebuilds, which
rewrites the canonical and Open Graph tags on all five pages and regenerates
the sitemap, robots.txt and llms.txt to match.

## Security headers

Generated into `public/_headers` by `tools/build-meta.js`: CSP, HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`.

The CSP is `script-src 'self'` and `connect-src 'self'` — there is no inline
script and the page reaches no third-party host. Verify after deploying:

```bash
curl -sI https://keepaustincolorful.com | grep -i content-security-policy
```

`vercel.json` and `netlify.toml` are left in the repo for anyone forking to
those hosts, but they are not the deploy path and they do not carry the CSP.

## Before you announce it

- Click every item in the top nav on a phone
- Drag the before/after slider, both plan and street view
- Type a real Austin address into the letter form and confirm the district
  fills in — that is the one thing that only works on Cloudflare
- Draft a letter, copy it, paste it somewhere
- Check the dates in `DATES` (in `public/site.js`) are still ahead of today
- Paste the URL into Slack and see whether the card renders
