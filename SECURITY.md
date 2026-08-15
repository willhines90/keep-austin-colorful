# Security

This is a static site. It has no backend, no database, no accounts and no
server-side code. Nothing anybody types into it is transmitted anywhere: the
letter builder runs entirely in the browser.

## Reporting

Open a GitHub issue for anything non-sensitive. For something you would rather
not post publicly, use GitHub's private vulnerability reporting on this repo.

## What is worth reporting

- A way to make the page execute script it should not (the CSP is hash-based;
  a bypass would be interesting)
- A way to make the address lookup send data anywhere other than the two
  permitted endpoints
- Anything that causes the site to make a network request it does not declare

## What is expected behaviour

- **The address lookup calls two third-party endpoints**: the US Census geocoder
  and Austin's open data portal. Both are declared in `connect-src`. Nothing but
  the address is sent, and only when someone types one.
- **Fonts load from Google Fonts.** Declared in the CSP.
- **Analytics are off by default.** With them enabled the relevant origin is
  added to the CSP and nothing else is.
- **`localStorage` holds your progress checklist and selections.** It never
  leaves the device.

## Verifying that yourself

```bash
curl -sI https://YOUR-DOMAIN | grep -i content-security-policy
```

The `script-src` hash should match the inline script in `public/index.html`.
`npm test` checks exactly that.
