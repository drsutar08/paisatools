/*
 * Writes the "Worked example" paragraph of each calculator into the HTML itself, so search engines
 * see it without running JavaScript. The page script still fills the same paragraph on load.
 * Run it after changing a calculator's example (needs jsdom: run `npm install` in tests/ once).
 *
 *   node tools/prerender.js
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole, ResourceLoader } = require(path.join(__dirname, '..', 'tests', 'node_modules', 'jsdom'));
const cfg = require('./site.config.js');
const root = path.join(__dirname, '..');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Loads the site's own scripts (e.g. calc-common.js) from disk; ads, analytics, fonts and site.js are skipped. */
class LocalOnly extends ResourceLoader {
  fetch(url, opts) {
    if (!url.startsWith(cfg.domain)) return null;
    const rel = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
    if (!/\.js$/.test(rel) || /(^|\/)site\.js$/.test(rel)) return null;
    const p = path.join(root, rel);
    return fs.existsSync(p) ? Promise.resolve(fs.readFileSync(p)) : null;
  }
}

(async () => {
  const files = cfg.calculators.flatMap(c => [c[0], 'hi/' + c[0]]).filter(f => fs.existsSync(path.join(root, f)));
  let changed = 0;
  for (const f of files) {
    const file = path.join(root, f);
    const html = fs.readFileSync(file, 'utf8');
    if (!/<p id="example">/.test(html)) continue;
    const dom = new JSDOM(html, { url: cfg.domain + f, runScripts: 'dangerously', resources: new LocalOnly(), pretendToBeVisual: true, virtualConsole: new VirtualConsole() });
    await new Promise(r => dom.window.addEventListener('load', r));
    const text = (dom.window.document.getElementById('example') || {}).textContent || '';
    dom.window.close();
    if (!text.trim()) { console.warn('no example text on', f); continue; }
    const out = html.replace(/<p id="example">[^<]*<\/p>/, () => `<p id="example">${esc(text)}</p>`);
    if (out !== html) { fs.writeFileSync(file, out); changed++; }
  }
  console.log(`pre-rendered worked examples on ${changed} of ${files.length} pages`);
})();
