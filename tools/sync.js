/*
 * Keeps the parts shared by every page identical: top menu, footer links, "More calculators" box,
 * skip-to-content link and the sitemap. Safe to run again and again.
 *
 *   node tools/sync.js
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./site.config.js');
const root = path.join(__dirname, '..');
const calcFiles = new Set(cfg.calculators.map(c => c[0]));
const EXTRA = new Set(['offline.html']);   // pages we never touch

function pages(dir, prefix) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.html') && !EXTRA.has(f)).map(f => prefix + f);
}
const list = [...pages(root, ''), ...(fs.existsSync(path.join(root, 'hi')) ? pages(path.join(root, 'hi'), 'hi/') : [])];

/* Clean URLs: GitHub Pages serves emi-calculator.html at /emi-calculator, so links drop the ".html". */
function cleanHref(u) {
  if (/^(mailto:|tel:|data:|javascript:|#)/.test(u)) return u;
  if (/^https?:/.test(u) && !u.startsWith(cfg.domain)) return u;
  const [p, hash] = u.split(/(?=#)/);
  let out;
  if (/(^|\/)index\.html$/.test(p)) out = p.replace(/index\.html$/, '') || './';
  else out = p.replace(/\.html$/, '');
  return out + (hash || '');
}
function cleanUrls(h) {
  h = h.replace(/href="([^"]*)"/g, (m, u) => `href="${cleanHref(u)}"`);
  // absolute addresses in canonical, hreflang, sharing tags and structured data
  const dom = cfg.domain.replace(/[.\/]/g, '\\$&');
  h = h.replace(new RegExp(dom + '([A-Za-z0-9_\\-\\/]*?)index\\.html', 'g'), cfg.domain + '$1');
  h = h.replace(new RegExp('(' + dom + '[A-Za-z0-9_\\-\\/]+)\\.html', 'g'), '$1');
  return h;
}
const readPage = f =>fs.readFileSync(path.join(root, f), 'utf8');
const guideTitle = f => ((readPage(f).match(/<h1[^>]*>([^<]*)<\/h1>/) || [])[1] || f).trim();
const guideDesc = f => ((readPage(f).match(/name="description" content="([^"]*)"/) || [])[1] || '').trim();
let changed = 0;
for (const rel of list) {
  const file = path.join(root, rel);
  const isHi = rel.startsWith('hi/');
  const name = path.basename(rel);
  const hindiExists = f => fs.existsSync(path.join(root, 'hi', f));
  // From a Hindi page, link to the Hindi twin if there is one, otherwise to the English page in the parent folder.
  const link = f => {
    if (!isHi) return f;
    if (f === 'index.html') return 'index.html';
    return (calcFiles.has(f) && hindiExists(f)) ? f : '../' + f;
  };
  const label = (en, hi) => (isHi ? hi : en);
  let h = fs.readFileSync(file, 'utf8');
  const before = h;

  // 1. Top menu
  const items = cfg.nav.map(n => `<a href="${link(n[0])}"${n[0] === name ? ' aria-current="page"' : ''}>${label(n[1], n[2])}</a>`);
  if (isHi) items.push(`<a href="../${name}" lang="en" hreflang="en-IN">English</a>`);
  const coffee = `<a class="coffee-btn coffee-sm" href="${cfg.support[0]}" target="_blank" rel="noopener noreferrer" title="${label(cfg.support[1], cfg.support[2])}"><span aria-hidden="true">☕</span><span class="coffee-text">${label(cfg.support[1], cfg.support[2])}</span></a>`;
  h = h.replace(/<a class="coffee-btn coffee-sm"[\s\S]*?<\/a>/, '');
  h = h.replace(/<nav class="site"[^>]*>[\s\S]*?<\/nav>/, `<nav class="site" aria-label="${isHi ? 'मुख्य' : 'Main'}">${items.join('')}</nav>${coffee}`);

  // 2. Footer links (both link rows are rebuilt, the disclaimer sentence is kept)
  h = h.replace(/<footer[^>]*>([\s\S]*?)<\/footer>/, (m, inner) => {
    // keep the page's own disclaimer sentence (always the last paragraph in the footer)
    const paras = [...inner.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
    const disclaimer = paras.length ? paras[paras.length - 1][1].trim() : '';
    const site = cfg.footerSite.map(s => `<a href="${isHi ? '../' + s[0] : s[0]}">${label(s[1], s[2])}</a>`);
    if (isHi) site.push('<a href="../index.html" lang="en">English</a>');
    else site.push(`<a href="${cfg.hindiHome}" lang="hi" hreflang="hi">हिन्दी</a>`);
    const cols = cfg.groups.map(g => {
      const links = cfg.calculators.filter(c => c[3] === g[0]).map(c => `<a href="${link(c[0])}">${label(c[1], c[2])}</a>`).join('');
      return `<nav aria-label="${label(g[1], g[2])}"><h2 class="f-h">${label(g[1], g[2])}</h2>${links}</nav>`;
    }).join('\n      ');
    return `<footer class="site-footer">
    <div class="f-top">
      <div class="f-brand"><a class="brand" href="index.html">paisa<span>tools</span></a><p>${label(cfg.blurb[0], cfg.blurb[1])}</p><a class="coffee-btn" href="${cfg.support[0]}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">☕</span> ${label(cfg.support[1], cfg.support[2])}</a></div>
      <div class="f-cols">
      ${cols}
      </div>
    </div>
    <div class="f-bottom">
      <p>${disclaimer}</p>
      <nav aria-label="${isHi ? 'साइट' : 'Site'}">${site.join('')}</nav>
    </div>
  </footer>`;
  });

  // 3. "More calculators" box (calculator pages only)
  if (calcFiles.has(name)) {
    const others = cfg.calculators.filter(c => c[0] !== name).slice(0, 10).map(c => `<a href="${link(c[0])}">${label(c[1], c[2])}</a>`).join('\n        ');
    const home = isHi ? '<a href="index.html">सभी कैलकुलेटर</a>' : '<a href="index.html#all">All calculators</a>';
    const g = cfg.guideFor[name];
    const guideLink = g ? `<a class="rel-guide" href="${isHi ? '../' : ''}${g}">${isHi ? 'गाइड (अंग्रेज़ी): ' : 'Read the guide: '}${guideTitle(g)}</a>\n        ` : '';
    h = h.replace(/<div class="related">[\s\S]*?<\/div>/, `<div class="related">\n        ${guideLink}<h3>${isHi ? 'और कैलकुलेटर' : 'More calculators'}</h3>\n        ${others}\n        ${home}\n      </div>`);
  }

  // The guides index is built from the list in the config
  if (name === 'guides.html' && !isHi) {
    const cards = cfg.guides.map(g => `    <a class="tool-card" href="${g[0]}"><span class="tag" style="background:var(--${g[2]})">${g[1]}</span><h2>${guideTitle(g[0])}</h2><p>${guideDesc(g[0])}</p><span class="go">Read the guide &rarr;</span></a>`).join('\n');
    h = h.replace(/<div class="tools" style="margin-top:8px">[\s\S]*?\n  <\/div>/, `<div class="tools" style="margin-top:8px">\n${cards}\n  </div>`);
  }

  // 4. Skip link and main landmark
  if (!h.includes('class="skip-link"')) {
    h = h.replace(/<body([^>]*)>/, `<body$1>\n<a class="skip-link" href="#content">${isHi ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}</a>`);
  }
  h = h.replace(/<main(?![^>]*id=)([^>]*)>/, '<main id="content"$1>');

  h = cleanUrls(h);
  if (h !== before) { fs.writeFileSync(file, h); changed++; }
}

// 5. Sitemap
const D = cfg.domain;
const rows = [];
const add = (loc, pr) => rows.push(`  <url><loc>${D}${loc.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')}</loc><lastmod>${cfg.lastmod}</lastmod><priority>${pr}</priority></url>`);
add('', '1.0');
cfg.calculators.forEach(c => add(c[0], '0.9'));
list.filter(f => !f.startsWith('hi/') && /^guide/.test(f)).forEach(f => add(f, '0.8'));
if (list.includes('hi/index.html')) add('hi/index.html', '0.8');
cfg.calculators.forEach(c => { if (fs.existsSync(path.join(root, 'hi', c[0]))) add('hi/' + c[0], '0.7'); });
cfg.legalPages.forEach(f => add(f, '0.3'));
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`);

console.log(`synced ${list.length} pages (${changed} changed), sitemap has ${rows.length} URLs`);
