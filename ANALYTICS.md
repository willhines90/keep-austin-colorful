# Analytics

**Cloudflare Web Analytics is the chosen provider.** Free, unsampled, no cookies,
no consent banner, and it runs on the host the site already sits on.

Nothing is enabled yet. With `cfToken` empty the site makes **no third-party
requests at all** beyond Google Fonts, and the CSP stays as tight as it can be.

## How it is set up

**Edge injection, no token in the repo.** In the Cloudflare dashboard, Web
Analytics is enabled for `keepaustincolorful.com` with *"Enable, excluding
visitor data in the EU"*. Cloudflare adds the beacon itself at the edge, so
there is nothing to paste into the code and nothing to rotate.

This only works because the apex is proxied through Cloudflare (orange cloud in
DNS). On a `*.workers.dev` URL it cannot work at all, which is why an earlier
attempt at this produced an empty dashboard and no error.

`cfAuto: true` in `public/site.js` is what makes the CSP allow the injected
script. **That flag is not cosmetic.** With it false, `script-src` stays
`'self'`, the browser drops the beacon Cloudflare inserted, and you get silence:
no console error, no dashboard data, nothing obviously wrong. A test asserts the
CSP and the config cannot disagree.

Excluding EU visitors sidesteps the consent question entirely. The trade is that
EU traffic goes uncounted, which for a campaign about one Austin street corner
is not a meaningful loss.

## If you would rather use a token

Choose *"Enable with JS Snippet installation"* in the dashboard instead, put the
token in `cfToken`, set `cfAuto` back to `false`, and run `npm run build`. The
beacon then ships in the page rather than being injected, which makes it visible
in version control and portable if you ever move hosts.

## Verifying it works

Load the site, open DevTools, filter the Network tab for `beacon`. You want
`static.cloudflareinsights.com/beacon.min.js` returning 200. Nothing at all
means injection is off; a blocked request means the CSP does not allow it.

Data takes a few minutes to appear.

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
