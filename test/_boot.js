/**
 * Shared test fixture.
 *
 * The site ships as index.html plus site.css and site.js. jsdom will not fetch
 * those two unless we turn on network-capable resource loading, which would
 * also drag Google Fonts into every test run and make the suite depend on the
 * internet. So we splice the real files back into the real HTML and drive the
 * assembled document.
 *
 * That is a convenience, and conveniences can lie. Suite 9 separately asserts
 * that the shipped index.html genuinely references both files and that neither
 * has gone missing, so a broken <link> or <script src> still fails the build.
 */
const fs = require('fs');
const path = require('path');

const PUB = path.join(__dirname, '..', 'public');
const read = f => fs.readFileSync(path.join(PUB, f), 'utf8');

const CSS_TAG = '<link rel="stylesheet" href="site.css">';
const JS_TAG = '<script src="site.js" defer></script>';

/** index.html (or any page) with the shared CSS and JS inlined. */
function inline(page) {
  const html = read(page || 'index.html');
  if (!html.includes(CSS_TAG)) throw new Error((page || 'index.html') + ' no longer links site.css');
  // Replacement must be a function. site.js defines $$ for querySelectorAll,
  // and '$$' in a string replacement means "a literal $" - so a plain string
  // replace silently rewrites every $$ to $, which clobbers the $ helper with
  // the querySelectorAll one and breaks the page in a way that looks like a
  // DOM problem. Cost an hour once; never again.
  return html
    .replace(CSS_TAG, () => '<style>\n' + read('site.css') + '\n</style>')
    .replace(JS_TAG, () => '<script>\n' + read('site.js') + '\n</script>');
}

/** Every page's markup concatenated, for assertions about the site as a whole
 *  (external links, spellings, tone) rather than about one page. */
function allHtml() {
  return PAGES.map(p => read(p)).join('\n<!-- page break -->\n') + '\n' + read('site.js') + '\n' + read('site.css');
}

/** Every page that carries the shared chrome. */
const PAGES = ['index.html', 'background.html', 'act.html', 'help.html', 'contact.html', 'press.html'];

module.exports = { inline, read, allHtml, PUB, PAGES, CSS_TAG, JS_TAG };
