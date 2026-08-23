# Analytics

**Cloudflare Web Analytics is the chosen provider.** Free, unsampled, no cookies,
no consent banner, and it runs on the host the site already sits on.

Nothing is enabled yet. With `cfToken` empty the site makes **no third-party
requests at all** beyond Google Fonts, and the CSP stays as tight as it can be.

## Status, as of 15 August 2026

Checked against the live deployment: **no beacon is loading and nothing is being
collected.** The code is wired and waiting; the switch has never been flipped.

## Why the current setting cannot work

The config used to say `cfAuto:true`, meaning "Cloudflare injects the beacon at
the edge, no code change needed." That is a real feature, but it only works when
traffic to the domain is **proxied through Cloudflare** (orange-clouded DNS).
A `*.workers.dev` URL is not a zone you control DNS for, so edge injection never
fires. That is why the dashboard has stayed empty.

`cfAuto` is now `false`, which matches reality. Use the token instead.

## Turning it on, the way that actually works

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics → Add a site**.
   Enter `keepaustincolorful.com`.
2. Choose **manual / JS snippet** setup. Copy the token it gives you.
3. Put it in `public/site.js` (near the top; **not** `public/index.html`, which is generated):

```js
var ANALYTICS={
  ga4:'',            // unused; Cloudflare is the provider
  cfToken:'PASTE_THE_TOKEN_HERE',
  cfAuto:false,      // leave false unless you are on a proxied custom domain
  respectDNT:true
};
```

4. Regenerate the CSP and redeploy:

```bash
npm run build && npm test && npx wrangler deploy
```

Step 4 is not optional. `build:meta` adds `static.cloudflareinsights.com` to
`script-src` only when a token is present. Skip it and the browser silently
drops the beacon, with no error anywhere obvious, and the dashboard stays empty
exactly as it does now. A test asserts the CSP and the config cannot disagree.

## Verifying it works

Load the site, open DevTools → Network, filter `beacon`. You want a request to
`static.cloudflareinsights.com/beacon.min.js` returning 200. No request means
the token is missing; a blocked request means you skipped `build:meta`.

Data takes a few minutes to appear in the dashboard.

## Google Analytics

Left in the code as an unused hook (`ga4`). If you ever fill it in, `build:meta`
opens the Google origins in the CSP automatically. Worth knowing that GA4 sets
first-party cookies (`_ga`) even with `anonymize_ip`, which is the main reason
Cloudflare was chosen instead.

## What is measured

Pageviews tell you very little for a site like this. The events below are the ones that indicate somebody actually did something:

| Event | Fires when | Detail |
|---|---|---|
| `letter_generated` | A letter is drafted | tone, number of asks |
| `letter_copied` | Letter copied to clipboard | whether it was edited first |
| `council_form_opened` | The council email form is opened | |
| `template_copied` | A script or template is copied | which action |
| `action_completed` | An item is ticked off | which action |
| `calendar_added` | A calendar file is downloaded | which event |
| `district_found` | The address lookup resolves | district number |

`letter_copied` with `edited: true` is the number worth watching. An edited letter is one a council office will weigh far more heavily than a form submission, so that ratio tells you whether the pack is doing its actual job.

## Vercel Analytics

Not included, and it cannot be. Vercel Analytics posts to `/_vercel/insights`, an endpoint that exists only on Vercel's own edge network. On Cloudflare there is nothing listening, so the script loads and the data goes nowhere. It is not a configuration problem.

If you move the site to Vercel it becomes available, but Cloudflare Web Analytics already does the same job here without cookies.

## Two things worth thinking about first

**The privacy line.** The site tells people *"Nothing you type is sent anywhere."* That stays literally true with GA enabled, since the letter text never leaves the browser. But an LGBTQ+ advocacy site in Texas sending visitor data to Google is a different proposition from one that sends nothing, and some of your visitors will have real reasons to care. Cloudflare Web Analytics gets you the numbers without that tension.

**Consent.** GA4 sets cookies. For a mostly-Austin audience there is no legal requirement, but if this gets shared beyond the US you would technically need a consent banner. Cloudflare Web Analytics needs none, anywhere.

My recommendation is Cloudflare alone, and to add GA only if you find you need something it cannot answer. But both are wired and ready, and it is your call.

`respectDNT` is on by default, so visitors sending Do Not Track are skipped entirely by either provider. Most analytics ignore that header. Given who this site is for, honouring it seemed right.
