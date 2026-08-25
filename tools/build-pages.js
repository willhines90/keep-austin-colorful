#!/usr/bin/env node
/**
 * Splits the single-page site into real pages that share one head, one nav,
 * one stylesheet and one script.
 *
 * Why a generator rather than four hand-maintained files: press.html was hand
 * maintained, and it quietly drifted back to Nunito and its own colour tokens
 * after the design system changed. Four hand-maintained pages would drift four
 * ways. The page bodies live in `src/pages/*.html`; this script wraps each one
 * in the shared chrome and writes public/*.html.
 *
 *   npm run build:pages
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const SRC = path.join(ROOT, 'src', 'pages');

// The one place the live domain is written down. set-domain.sh edits this
// line; build-meta.js then reads it back out of the generated canonical tag
// and rewrites sitemap.xml, robots.txt and llms.txt to match.
const DEFAULT_DOMAIN = 'https://keepaustincolorful.com';
const DOMAIN = process.env.SITE_DOMAIN || DEFAULT_DOMAIN;

/* ── the pages, in nav order ──────────────────────────────────────────────
   `body` is the file in src/pages. `ld` marks the page that carries the
   JSON-LD graph, which build-meta.js writes and which belongs on one page. */
const PAGES = [
  { file: 'index.html',      nav: 'Home',        ld: true,
    title: 'Keep Austin Colorful: Pride colors back on 4th & Colorado',
    desc: "The rainbow crosswalk in Austin's LGBTQ+ district came up in July under a state order. A mural went up in June, a historical marker on 21 August, and the sidewalk is the one thing still missing. San Antonio has already shown a Texas city can paint one lawfully, with no council vote." },

  { file: 'background.html', nav: 'Background',
    title: 'Background: how five Texas cities answered the crosswalk order',
    desc: 'The timeline, what San Antonio, Dallas and El Paso did instead, why the state order stops at the curb, who pays for this kind of work, and honest answers to the objections officials actually raise.' },

  { file: 'act.html',        nav: 'Write a letter',
    title: 'Write to Austin City Council about 4th & Colorado, in five minutes',
    desc: 'Pick what you would like to see at 4th and Colorado, say where the money could come from, and draft a letter in your own words. Your address finds your council district automatically.' },

  { file: 'help.html',       nav: 'Ways to help',
    title: 'Ways to help: twelve things, sorted by how long they take',
    desc: 'Twelve concrete actions for the rainbow sidewalk campaign at 4th and Colorado, from a five-minute phone call to speaking at a council meeting, plus the upcoming council and commission dates.' },

  { file: 'contact.html',    nav: 'Contact',
    title: 'Contact: who picks up the phone at Austin City Council',
    desc: 'Direct numbers for the Mayor and every council district, a thirty-second phone script, how to sign up to speak at council, and how to reach this project.' },

  { file: 'press.html',      nav: 'Press',
    title: 'Press kit | Keep Austin Colorful',
    desc: 'Facts, figures, images and contact for reporters covering the rainbow crosswalk removal at 4th and Colorado, and the sidewalk route other Texas cities have taken.' }
];

const ATX_LOGO = fs.readFileSync(path.join(SRC, '_logo.svg'), 'utf8').trim();
// The no-JavaScript fallback carries the whole argument and the phone numbers.
// It belongs on every page, not just the one it happened to start on.
const NOSCRIPT = fs.readFileSync(path.join(SRC, '_noscript.html'), 'utf8').trim();

const REPO = 'https://github.com/willhines90/keep-austin-colorful';

/* Octicon mark-github, 16px grid. Inline rather than a font or an <img> so it
   inherits currentColor and costs no extra request. */
const GH_ICON = '<svg class="gh" viewBox="0 0 16 16" width="20" height="20" aria-hidden="true" focusable="false" fill="currentColor">'
  + '<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>';

const nav = current => `<header class="topbar">
  <div class="wrap topbar-in">
    <a class="brandlink" href="/"${current === 'Home' ? ' aria-current="page"' : ''}>
      <span class="brandmark">${ATX_LOGO}</span>
      <span class="brandtext"><b>Keep Austin Colorful</b><i>Bringing the color back to 4th &amp; Colorado</i></span>
    </a>
    <nav class="mainnav" aria-label="Main">
${PAGES.map(p => {
  const href = p.file === 'index.html' ? '/' : '/' + p.file;
  const cur = p.nav === current ? ' aria-current="page"' : '';
  return `      <a href="${href}"${cur}>${p.nav}</a>`;
}).join('\n')}
      <a class="ghlink" href="${REPO}" target="_blank" rel="noopener"
         title="This site is open source. Fork it for your city."
         aria-label="Source code on GitHub (opens in a new tab)">${GH_ICON}</a>
    </nav>
  </div>
  <div class="topbar-flag" aria-hidden="true"></div>
</header>`;

const head = p => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="canonical" href="${DOMAIN}${p.file === 'index.html' ? '/' : '/' + p.file}">
<meta name="description" content="${p.desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
<meta name="author" content="Keep Austin Colorful">
<meta name="robots" content="index,follow">
<meta property="og:url" content="${DOMAIN}${p.file === 'index.html' ? '/' : '/' + p.file}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Keep Austin Colorful: bringing the color back to 4th &amp; Colorado">
<meta property="og:title" content="${p.title.replace(/&/g, '&amp;')}">
<meta property="og:description" content="${p.desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
<meta property="og:image" content="${DOMAIN}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="A Pride flag background with a card reading: Let's put the color back on 4th St.">
<!-- NOTE: og.png still carries the pre-August wording. og-source.svg has the
     current headline; regenerate the PNG with rsvg-convert and update this alt. -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title.replace(/&/g, '&amp;')}">
<meta name="twitter:description" content="${p.desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
<meta name="twitter:image" content="${DOMAIN}/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400..800;1,400..600&family=Poppins:ital,wght@0,500;0,600;0,700;1,500&display=swap">
<link rel="icon" href="/favicon.svg">
<meta name="theme-color" content="#15151D">
<title>${p.title.replace(/&/g, '&amp;')}</title>
<link rel="stylesheet" href="site.css">
</head>`;

const footer = `<footer>
  <p><b>Keep Austin Colorful</b> is a play on Keep Austin Weird, and the color in it is paint. A neighbor's project, built August 2026. Not affiliated with the City of Austin, and not legal advice. Every claim on this site links to its source. Copy it, fork it, point it at your own city. <a href="/contact.html">Get in touch</a>.</p>
  <p class="footlinks">
    <a href="${REPO}" target="_blank" rel="noopener">${GH_ICON}<span>Source on GitHub</span></a>
    <a href="${REPO}/blob/main/FORKING.md" target="_blank" rel="noopener"><span>Fork it for your city</span></a>
    <a href="/press.html"><span>Press kit</span></a>
  </p>
  <p class="verified" id="verified"></p>
</footer>`;

const RBAR = '<div class="rbar"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i><i class="b5"></i><i class="b6"></i></div>';

let written = 0;
for (const p of PAGES) {
  const body = fs.readFileSync(path.join(SRC, p.file), 'utf8').trim();
  const out = [
    head(p),
    '<body>',
    '<a class="skip" href="#main">Skip to content</a>',
    NOSCRIPT,
    RBAR,
    nav(p.nav),
    '',
    '<div class="wrap">',
    '<main id="main" tabindex="-1">',
    body,
    '</main>',
    '',
    footer,
    '</div>',
    '',
    RBAR,
    '<div class="toast" id="toast" role="status"></div>',
    '',
    '<script src="site.js" defer></script>',
    '</body>',
    '</html>',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(PUB, p.file), out);
  written++;
}

console.log('pages       ', PAGES.map(p => p.file).join(', '));
console.log('written     ', written, 'pages from src/pages/, all sharing site.css and site.js');
console.log('next        ', 'npm run build:meta   (JSON-LD, sitemap, llms.txt, headers)');
