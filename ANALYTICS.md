# Analytics

Nothing is enabled by default. With both fields empty the site makes **no third-party requests at all** beyond Google Fonts, and the Content-Security-Policy stays as tight as it can be.

## Turning it on

Both switches live at the top of the script block in `public/index.html`:

```js
var ANALYTICS={
  ga4:'',            // 'G-XXXXXXXXXX' from Google Analytics
  cfToken:'',        // token from Cloudflare Web Analytics (cookieless)
  respectDNT:true    // skip analytics for visitors who ask not to be tracked
};
```

Fill in whichever you want, then:

```bash
npm run build:meta
```

That regenerates the CSP so it permits **only** the origins the enabled provider needs. If you skip this step the browser will block the analytics script and you will see nothing. That is the CSP working correctly.

## Google Analytics 4

Create a property at [analytics.google.com](https://analytics.google.com), take the `G-` measurement ID, and put it in `ga4`.

`anonymize_ip` is set. GA4 still sets first-party cookies (`_ga`), which is worth knowing given the two caveats below.

## Cloudflare Web Analytics — the one in use

Free, unsampled, **no cookies**, no consent banner, and on the host the site already runs on.

There are two ways to switch it on, and both need the CSP to allow the beacon.

**Edge injection, no code change.** Cloudflare dashboard → Analytics & Logs → Web
Analytics → enable for this site. Cloudflare adds the beacon itself at the edge.
`cfAuto:true` is already set, so the CSP permits it and it will just work.

This is the path in use. Nothing further is needed.

**Explicit token, if you prefer it in version control.** Take the token from the
same dashboard page, put it in `cfToken`, and run `npm run build:meta`. The
beacon is then part of the page rather than injected, which makes it visible in
the repo and portable if you ever move hosts.

Either way, the CSP entry is what makes it work. Without it the browser drops the
beacon and the dashboard stays empty with no error anywhere obvious.

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
