#!/usr/bin/env node
/**
 * Draws every version of the ATX wordmark from one set of letterforms.
 *
 * Two outputs per variant:
 *   src/pages/_logo-<name>.svg   inlined into the page chrome by build-pages
 *   public/logo-<name>.svg       standalone, for the press kit and the README
 *
 * The standalone copies carry `xmlns`. The inline ones do not need it, but a
 * standalone SVG without it does not render as an <img> at all — it just fails,
 * silently and completely. That is worth a generator on its own.
 *
 *   npm run build:logos
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'pages');
const PUB = path.join(ROOT, 'public');

/* The letterforms. One path, evenodd, so the counters in A and X stay open. */
const ATX = 'M0,48 L12,0 L22,0 L34,48 L23.4,48 L21.2,38.6 L12.8,38.6 L10.6,48 Z '
          + 'M17,13 L13.9,29.4 L20.1,29.4 Z '
          + 'M40,0 L74,0 L74,10.5 L62.6,10.5 L62.6,48 L51.4,48 L51.4,10.5 L40,10.5 Z '
          + 'M80,0 L91.5,0 L97,10 L102.5,0 L114,0 L102.8,24 L114,48 L102.5,48 L97,38 L91.5,48 L80,48 L91.2,24 Z';
const W = 114, H = 48;

const PRIDE = ['#e40303', '#ff8c00', '#ffd500', '#008026', '#24408e', '#732982'];
const TRANS = ['#5BCEFA', '#F5A9B8', '#FFFFFF', '#F5A9B8', '#5BCEFA'];
/* Quasar's chevron, drawn outermost-last so each colour reads as a band. */
const CHEVRON = [
  { c: '#FFFFFF', apex: 46 },
  { c: '#FFAFC8', apex: 38 },   // trans pink
  { c: '#74D7EE', apex: 30 },   // trans blue
  { c: '#613915', apex: 22 },   // brown
  { c: '#000000', apex: 14 }
];

const stripes = (colors, w = W, h = H, y0 = 0) => {
  const band = h / colors.length;
  return colors.map((c, i) =>
    `<rect x="0" y="${+(y0 + i * band).toFixed(3)}" width="${w}" height="${+band.toFixed(3)}" fill="${c}"/>`
  ).join('');
};

const chevron = () => CHEVRON.map(b =>
  `<polygon points="-30,0 ${b.apex},${H / 2} -30,${H}" fill="${b.c}"/>`
).join('');

const clip = id => `<defs><clipPath id="${id}"><path clip-rule="evenodd" d="${ATX}"/></clipPath></defs>`;

/* ── the variants ───────────────────────────────────────────────────────── */
const VARIANTS = {
  // the original: solid letters with a six-stripe band across the middle
  band: () => {
    const t = 2.75, top = 16;
    const bands = PRIDE.map((c, i) =>
      `<rect x="0" y="${(top + i * 2.667).toFixed(3)}" width="${W}" height="${t}" fill="${c}"/>`).join('');
    return { vb: `0 0 ${W} ${H}`, body:
      clip('atxclip') +
      `<path fill-rule="evenodd" d="${ATX}" fill="#15151D"/>` +
      `<g clip-path="url(#atxclip)">${bands}</g>` };
  },

  // the letters ARE the flag, edge to edge
  flag: () => ({ vb: `0 0 ${W} ${H}`, body:
    clip('atxflag') + `<g clip-path="url(#atxflag)">${stripes(PRIDE)}</g>` }),

  // reverse space: a rainbow tile with the letters cut out to transparent
  knockout: () => {
    const px = 13, py = 7, w = W + px * 2, h = H + py * 2;
    return { vb: `0 0 ${w} ${h}`, body:
      `<defs><mask id="atxknock">` +
      `<rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="#fff"/>` +
      `<path transform="translate(${px},${py})" fill-rule="evenodd" d="${ATX}" fill="#000"/>` +
      `</mask></defs>` +
      `<g mask="url(#atxknock)">${stripes(PRIDE, w, h)}</g>` };
  },

  /* Alternate mark, not the primary. The trans flag's middle stripe is white,
     so inside letterforms on a pale ground the heart of every letter vanishes;
     the dark tile is structural, not decoration. That makes this variant
     conditional on a container the Pride version does not need, which is why
     it is not the default. */
  trans: () => {
    const px = 13, py = 7, w = W + px * 2, h = H + py * 2;
    return { vb: `0 0 ${w} ${h}`, body:
      `<defs><clipPath id="atxtrans"><path transform="translate(${px},${py})" clip-rule="evenodd" d="${ATX}"/></clipPath></defs>` +
      `<rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="#15151D"/>` +
      `<g clip-path="url(#atxtrans)">${stripes(TRANS, w, h)}</g>` };
  },

  /* Alternate mark. At header size the five chevron bands compress to under
     two pixels each and read as a smear, so use this at larger sizes only. */
  progress: () => ({ vb: `0 0 ${W} ${H}`, body:
    clip('atxprog') + `<g clip-path="url(#atxprog)">${stripes(PRIDE)}${chevron()}</g>` }),

  /* Alternate mark. The tile gives the chevron room to read, at the cost of
     being about 40% wider than the primary lockup. */
  'progress-knockout': () => {
    const px = 13, py = 7, w = W + px * 2, h = H + py * 2;
    const scale = w / W;
    const chev = CHEVRON.map(b =>
      `<polygon points="-30,0 ${(b.apex * scale).toFixed(2)},${(h / 2).toFixed(2)} -30,${h}" fill="${b.c}"/>`).join('');
    return { vb: `0 0 ${w} ${h}`, body:
      `<defs><mask id="atxprogknock">` +
      `<rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="#fff"/>` +
      `<path transform="translate(${px},${py})" fill-rule="evenodd" d="${ATX}" fill="#000"/>` +
      `</mask></defs>` +
      `<g mask="url(#atxprogknock)">${stripes(PRIDE, w, h)}${chev}</g>` };
  }
};

const ALT = {
  band: 'The letters ATX with a six-stripe Pride band across the middle.',
  flag: 'The letters ATX filled edge to edge with the six colors of the Pride flag.',
  knockout: 'A rounded rainbow tile with the letters ATX cut out of it.',
  trans: 'The letters ATX filled with the trans flag, on a dark tile.',
  progress: 'The letters ATX filled with the Progress Pride flag, stripes and chevron.',
  'progress-knockout': 'A rounded Progress Pride tile with the letters ATX cut out of it.'
};

let n = 0;
for (const [name, make] of Object.entries(VARIANTS)) {
  const { vb, body } = make();
  const cls = 'atx' + (name === 'band' ? '' : ' atx-' + name);

  // inline: no xmlns needed, aria-hidden because the wordmark sits inside a
  // link that already has an accessible name
  fs.writeFileSync(path.join(SRC, `_logo-${name}.svg`),
    `<svg class="${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>\n`);

  // standalone: xmlns is mandatory, and it gets a real title
  fs.writeFileSync(path.join(PUB, `logo-${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-labelledby="t">`
    + `<title id="t">${ALT[name]}</title>${body}</svg>\n`);
  n++;
}

// the default lockup, whichever variant the header uses
fs.copyFileSync(path.join(SRC, '_logo-flag.svg'), path.join(SRC, '_logo.svg'));

console.log('logos       ', Object.keys(VARIANTS).join(', '));
console.log('written     ', n * 2, 'files (inline in src/pages, standalone with xmlns in public)');
