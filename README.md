# Keep Austin Colorful

An advocacy pack for putting the color back on 4th &amp; Colorado in Austin, Texas.

**Live:** _add your URL here after the first deploy_

---

## What this is

In October 2025 the Texas governor ordered the state transportation department to withhold road funding from any city that kept "political" street art. Austin's rainbow crosswalk at West 4th and Colorado, installed in 2021 in the heart of the city's LGBTQ+ district, came up on 20–21 July 2026. Every Texas city that applied for an exemption was denied.

San Antonio, facing the same order, painted its **sidewalks** rainbow instead. Two blocks of North Main Avenue, roughly $170,000, dedicated in March 2026, still there. It survived a legal challenge and cost the city no road funding. And it needed no council vote, because that corridor already held Pride Cultural Heritage District status.

The state's order reaches the road. Sidewalks belong to the city. This site explains that distinction, shows what four other Texas cities did, and helps a resident write to their council member in about five minutes.

## Running it

There is no build step. `index.html` is a single self-contained file with all CSS, JavaScript and artwork inlined, and it makes no external requests except web fonts.

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Tests

```bash
npm install
npm test
```

243 checks across seven suites. They boot the page in jsdom and drive the real interface. See [test/README.md](test/README.md) for what each one covers and why a few of them encode decisions rather than mechanics.

## Deploying

See [DEPLOY.md](DEPLOY.md). Short version: `npx vercel --prod` from this directory.

After your first deploy, point the share image at your real domain, or link previews will be blank in some clients:

```bash
sed -i '' 's|content="/og.png"|content="https://YOUR-DOMAIN/og.png"|g' index.html
```

## Forking this for your city

The structure generalizes. Most of what you'd change lives in clearly-marked data objects near the top of the `<script>` block in `index.html`:

| What | Where |
|---|---|
| Timeline entries | `TIMELINE` |
| Cities on the map and their corridor illustrations | `CITIES` |
| The asks people can select | `ASKS` |
| Funding routes | `FUNDS` |
| Objections and answers | `OBJS` |
| The action list and its templates | `TODOS` |
| Council meeting dates for the calendar files | `ICS` |
| Source links | `SRC` |

Map pin positions are projected latitude/longitude in a 100 × 94.4 viewBox. If you swap in a different state, you'll need to regenerate the outline path and the pin coordinates together.

`og-source.svg` is the editable source for the share image.

## A note on tone

This pack works because it asks for something a city can lawfully say yes to, and because every factual claim links to its source. If you adapt it, please keep both of those true. The moment it reads as an accusation rather than an invitation, it gets easier to ignore.

## Credits and sources

Reporting drawn from the Texas Tribune, TPR, the San Antonio Report, KENS5, KUT, Axios Austin and KVUE. Council dates from the City of Austin's published 2026 calendar. Every claim on the site links to the piece it came from.

Not affiliated with the City of Austin. Not legal advice.

## License

MIT for the code. The written content is offered under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — take it, adapt it, point it at your own city.
