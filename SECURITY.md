# Security

The site is five static pages plus **one small server-side route**. There is no
database, no accounts and no user data at rest.

The one piece of server-side code is a Cloudflare Worker, `src/worker.js`,
serving `/api/district`. It exists because the US Census geocoder answers
server-to-server requests but returns 503 to anything sending a browser `Origin`
header, so the address-to-council-district lookup cannot run in the page.

## What is and is not transmitted

This distinction matters, so it is worth being exact about:

- **The letter builder runs entirely in the browser.** Your name, address,
  story and finished letter are never sent anywhere. Nothing is posted, logged
  or transmitted. You copy the result yourself.
- **The district lookup does send one thing: the address you type into it.**
  It goes to `/api/district` on this domain, and the worker forwards it to the
  US Census geocoder and to `data.austintexas.gov`. Only the address is sent,
  only when you type one, and the normalized form is cached at Cloudflare's edge
  for 24 hours. If that is not something you want, leave the field empty and
  pick your district from the dropdown; the form works exactly as well.
- **`localStorage` holds your progress checklist and your selections.** It never
  leaves the device.
- **Fonts load from Google Fonts.** Declared in the CSP.
- **Analytics are off.** With a token configured, the relevant origin is added
  to the CSP and nothing else is.

## Reporting

Open a GitHub issue for anything non-sensitive. For something you would rather
not post publicly, use GitHub's private vulnerability reporting on this repo.

## What is worth reporting

- A way to make a page execute script it should not
- A way to use `/api/district` as a general-purpose proxy. `cleanAddress()` in
  `src/worker.js` caps input at 120 characters, requires a digit and at least
  four letters, appends `, Austin TX`, and the route rejects anything that is
  not GET or HEAD. If you can get past all of that, we would like to know.
- A way to make the site reach a host it does not declare
- Anything that causes an address to be logged, retained or forwarded beyond
  the two upstreams named above

## Verifying that yourself

```bash
curl -sI https://keepaustincolorful.com | grep -i content-security-policy
```

You should see `script-src 'self'` and `connect-src 'self'`.

There is no inline script anywhere on the site and therefore no CSP hash to
match: behavior lives in `public/site.js`. `connect-src 'self'` is the load-
bearing line — it means the page itself cannot reach any third-party host, and
the only outbound calls happen in the worker, where you can read them.

`npm test` asserts all of this: that no inline script survives, that the CSP
carries no `unsafe-inline` and no leftover `sha256-`, and that `connect-src`
never regrows a third-party origin.
