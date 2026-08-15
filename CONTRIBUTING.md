# Contributing

Corrections are the most valuable thing you can send. This site argues that a
city should do something specific, and the argument only works if every factual
claim on it holds up.

## Reporting something wrong

Open an issue. If a figure, date, phone number or link is wrong, please include
where the correct version comes from. Facts on this site are meant to be
checkable, so a correction without a source cannot be applied.

## Running it

```bash
npm install
npm run dev      # serves ./public on :8000
npm test         # 326 checks, about 50 seconds
```

## Making a change

```bash
npm run build:meta   # after ANY content edit
npm test
```

`build:meta` regenerates the JSON-LD, sitemap, `llms.txt` and the
Content-Security-Policy script hash from the page itself. If you skip it, the
deployed CSP will block the site's own JavaScript. CI checks this, so a stale
build will fail the PR rather than production.

## House rules for copy

Two, and they are the reason the site works.

**Everything factual links to a source.** If you cannot cite it, cut it.

**Write as though the reader wants to help.** The city complied with a state
order under a real funding threat and has already responded with a mural and a
historical marker. The ask is to build on that. There is a test that fails if
certain removed phrases come back, because an accusatory tone is easy to
reintroduce one word at a time and it makes the site easier to dismiss.

## Scope

Happy to receive: factual corrections, accessibility fixes, bugs, and adaptations
for other cities (see [FORKING.md](FORKING.md)).

Please open an issue first for: a redesign, a new framework or build step, or
anything that adds a runtime dependency. The single-file, no-build structure is
deliberate. It means the site can be understood, audited and hosted by anyone.
