/*
 * Keeps the parts shared by every page identical: top menu, footer links, "Related calculators" box,
 * hreflang links, breadcrumbs, author and "Last updated" line, official sources, guide links,
 * skip-to-content link and the sitemap. Safe to run again and again.
 *
 *   node tools/sync.js
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./site.config.js');
const root = path.join(__dirname, '..');
const calcFiles = new Set(cfg.calculators.map(c => c[0]));
const EXTRA = new Set(['offline.html', 'ad-frame.html']);   // pages we never touch
const D = cfg.domain;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const urlOf = rel => D + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
const calcName = (file, hi) => { const c = cfg.calculators.find(x => x[0] === file); return c ? (hi ? c[2] : c[1]) : file; };
const short2file = s => s + (s === 'retirement-planner' ? '.html' : '-calculator.html');
const dateFor = name => (cfg.updatedFor || {})[name] || cfg.lastmod;
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_HI = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
const fmtDate = (iso, hi) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${(hi ? MONTHS_HI : MONTHS_EN)[m - 1]} ${y}`; };
/* Replace the block between <!--key--> and <!--/key-->, or insert it with `insert(h, block)` the first time. */
function block(h, key, html, insert) {
  const re = new RegExp(`<!--${key}-->[\\s\\S]*?<!--/${key}-->`);
  const b = `<!--${key}-->${html}<!--/${key}-->`;
  if (re.test(h)) return h.replace(re, () => b);
  return insert(h, b);
}
for (const [k, v] of Object.entries(cfg.related)) for (const s of [k, ...v]) if (!calcFiles.has(short2file(s))) throw new Error('related: unknown calculator ' + s);
for (const v of Object.values(cfg.guideCalcs)) for (const s of v) if (!calcFiles.has(short2file(s))) throw new Error('guideCalcs: unknown calculator ' + s);

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
    else site.push(`<a href="${cfg.hindiHome}" lang="hi" hreflang="hi-IN">हिन्दी</a>`);
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

  // 3. "Related calculators" box (calculator pages only)
  const short = name.replace(/(-calculator)?\.html$/, '');
  if (calcFiles.has(name)) {
    const relCalcs = (cfg.related[short] || []).map(short2file);
    const others = relCalcs.map(f => `<a href="${link(f)}">${calcName(f, isHi)}</a>`).join('\n        ');
    const home = isHi ? '<a href="index.html">सभी कैलकुलेटर</a>' : '<a href="index.html#all">All calculators</a>';
    const g = cfg.guideFor[name];
    const guideLink = g ? `<a class="rel-guide" href="${isHi ? '../' : ''}${g}">${isHi ? 'गाइड (अंग्रेज़ी): ' : 'Read the guide: '}${guideTitle(g)}</a>\n        ` : '';
    h = h.replace(/<div class="related">[\s\S]*?<\/div>/, `<div class="related">\n        ${guideLink}<h3>${isHi ? 'संबंधित कैलकुलेटर' : 'Related calculators'}</h3>\n        ${others}\n        ${home}\n      </div>`);
  }

  const head = h.split('</head>')[0];
  const indexable = !/<meta name="robots" content="[^"]*noindex/.test(head);
  const isGuide = !isHi && /^guide-/.test(name);
  const isHome = name === 'index.html';
  const date = dateFor(name);

  // 3a. hreflang: English and Hindi twins point at each other; x-default is the English page.
  if (indexable && /<link rel="canonical"[^>]*>/.test(h)) {
    const enRel = name, hiRel = 'hi/' + name;
    const hasHi = fs.existsSync(path.join(root, hiRel));
    const alts = [['en-IN', urlOf(enRel)]];
    if (isHi || hasHi) alts.push(['hi-IN', urlOf(hiRel)]);
    alts.push(['x-default', urlOf(enRel)]);
    h = h.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '');
    h = h.replace(/(<link rel="canonical"[^>]*>\n?)/, (m) => m + alts.map(a => `<link rel="alternate" hreflang="${a[0]}" href="${a[1]}">\n`).join(''));
  }

  // 3b. Breadcrumbs: visible trail at the top of the page plus matching BreadcrumbList structured data.
  if (indexable && !isHome) {
    const pageName = calcFiles.has(name) ? calcName(name, isHi)
      : isGuide ? guideTitle(name)
      : ((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || name).replace(/<[^>]+>/g, '').trim();
    const trail = [[isHi ? 'होम' : 'Home', 'index.html', urlOf(isHi ? 'hi/index.html' : 'index.html')]];
    if (isGuide) trail.push(['Guides', 'guides.html', urlOf('guides.html')]);
    trail.push([pageName, null, urlOf(rel)]);
    const vis = `<nav class="crumbs" aria-label="${isHi ? 'ब्रेडक्रंब' : 'Breadcrumb'}"><ol>` +
      trail.map(t => t[1] ? `<li><a href="${t[1]}">${esc(t[0])}</a></li>` : `<li aria-current="page">${esc(t[0])}</li>`).join('') + '</ol></nav>';
    h = block(h, 'crumbs', vis, (s, b) => s.replace(/(<main[^>]*>[\s\S]*?<div class="(?:intro|page)">)/, `$1\n    ${b}`));
    const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t[0], item: t[2] })) });
    const ldRe = /<script type="application\/ld\+json">\{"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"BreadcrumbList"[\s\S]*?<\/script>/;
    const tag = `<script type="application/ld+json">${ld}</script>`;
    h = ldRe.test(h) ? h.replace(ldRe, () => tag) : h.replace('</head>', tag + '\n</head>');
  }

  // 3c. Author and "Last updated" line on calculators and guides.
  if (calcFiles.has(name) || isGuide) {
    const aName = isHi ? cfg.author.nameHi : cfg.author.name;
    const by = isHi
      ? `<p class="byline">लेखक: <a href="../about.html#author" rel="author">${esc(aName)}</a> <span aria-hidden="true">·</span> अंतिम अपडेट: <time datetime="${date}">${fmtDate(date, true)}</time></p>`
      : `<p class="byline">By <a href="about.html#author" rel="author">${esc(aName)}</a> <span aria-hidden="true">·</span> Last updated: <time datetime="${date}">${fmtDate(date, false)}</time></p>`;
    h = block(h, 'byline', by, (s, b) => /<p class="guide-meta">[^<]*<\/p>/.test(s)
      ? s.replace(/<p class="guide-meta">[^<]*<\/p>/, () => b)
      : s.replace(/(<main[\s\S]*?<\/h1>)/, `$1\n    ${b}`));
  }

  // 3d. Article structured data on guides: author and dates.
  if (isGuide) {
    h = h.replace(/<script type="application\/ld\+json">(\{[^<]*"@type":"Article"[^<]*)<\/script>/, (m, json) => {
      const j = JSON.parse(json);
      j.author = { '@type': 'Person', name: cfg.author.name, url: D + 'about#author' };
      j.datePublished = j.datePublished || cfg.published;
      j.dateModified = date;
      return `<script type="application/ld+json">${JSON.stringify(j)}</script>`;
    });
  }

  // 3e. "Try the calculator" links on guides.
  if (isGuide && cfg.guideCalcs[name]) {
    const links = cfg.guideCalcs[name].map(short2file).map(f => `<a href="${f}">${calcName(f, false)}</a>`).join('');
    h = h.replace(/<p class="calc-links">[\s\S]*?<\/p>/, () => `<p class="calc-links">${links}</p>`);
  }

  // 3f. Official sources section.
  const src = cfg.sourcesFor[name];
  if (src && (calcFiles.has(name) || isGuide)) {
    const items = src.map(k => { const s = cfg.officialSources[k]; return `<li><a href="${s[2]}">${esc(isHi ? s[1] : s[0])}</a>: ${esc(isHi ? s[4] : s[3])}</li>`; }).join('');
    const sec = isHi
      ? `<section class="sources" aria-labelledby="h-sources"><h2 id="h-sources">आधिकारिक स्रोत</h2><p>इस पेज के नियम और दरें इन आधिकारिक स्रोतों पर आधारित हैं। फ़ैसला लेने से पहले नवीनतम अधिसूचना ज़रूर देखें।</p><ul>${items}</ul></section>`
      : `<section class="sources" aria-labelledby="h-sources"><h2 id="h-sources">Sources</h2><p>The rules and rates on this page are based on these official sources. Check them for the latest notifications before you decide.</p><ul>${items}</ul></section>`;
    h = block(h, 'sources', sec, (s, b) => isGuide
      ? s.replace(/(\n\s*)(<p class="meta">)/, `$1${b}$1$2`)
      : s.replace(/(\n\s*)(<\/article>)/, `$1  ${b}$1$2`));
  }

  // 3h. Homepage: author link, every calculator grouped by category, latest guides, ItemList data.
  if (isHome && !isHi) {
    h = block(h, 'home-author', `<a href="about.html#author">${esc(cfg.author.name)}</a>`, s => s);
    // Reuse each calculator's existing tile (hand-written description and example); make a plain one if missing.
    const tiles = {};
    for (const m of h.matchAll(/<a class="tile"[^>]*href="([^"#]*)"[^>]*>[\s\S]*?<\/a>/g)) tiles[m[1].replace(/\.html$/, '')] = m[0];
    const tileFor = (c, key) => {
      const slug = c[0].replace(/\.html$/, '');
      let t = tiles[slug] || `<a class="tile" href="${c[0]}"><span class="ico">₹</span><h4>${esc(c[1])}</h4><small></small></a>`;
      t = t.replace(/<a class="tile"[^>]*?href="[^"]*"/, `<a class="tile" data-c="${key}" href="${c[0]}"`);
      return t.replace(/<h3>([\s\S]*?)<\/h3>/, '<h4>$1</h4>');
    };
    const groupsHtml = cfg.groups.map(g => {
      const list = cfg.calculators.filter(c => c[3] === g[0]);
      return `      <section class="catgroup" aria-labelledby="c-${g[0]}">
        <div class="cat-head"><h3 id="c-${g[0]}">${esc(g[1])} <small>(${list.length})</small></h3><p>${esc(g[3] || '')}</p></div>
        <div class="grid">
          ${list.map(c => tileFor(c, g[0])).join('\n          ')}
        </div>
      </section>`;
    }).join('\n');
    h = block(h, 'home-calcs', `\n    <div class="catgroups">\n${groupsHtml}\n    </div>\n    `, s => s);

    // Latest guides: newest datePublished first. Guides published on the same day alternate between topics
    // (Tax, Loans, Investing...) so the homepage shows a mix, otherwise they keep the config order.
    const pub = f => { const m = readPage(f).match(/"datePublished":"([^"]+)"/); return m ? m[1] : cfg.published; };
    const all = cfg.guides.map((g, i) => ({ g, i, d: pub(g[0]) }));
    const seen = {};
    all.forEach(x => { x.round = seen[x.d + '|' + x.g[1]] = (seen[x.d + '|' + x.g[1]] ?? -1) + 1; });
    const latest = all.sort((a, b) => b.d.localeCompare(a.d) || a.round - b.round || a.i - b.i).slice(0, cfg.homeGuides || 6);
    const cards = latest.map(({ g, d }) => `      <a class="pcard ${g[2]}" href="${g[0]}"><div class="ptop">${esc(g[1])}</div><h3>${esc(guideTitle(g[0]))}</h3><p class="gdesc">${esc(guideDesc(g[0]))}</p><div class="pfoot"><span>Published <time datetime="${d}">${fmtDate(d, false)}</time></span><span class="go">Read →</span></div></a>`).join('\n');
    h = block(h, 'home-guides', `\n    <div class="sec-head"><h2 id="h-guides">Latest money guides</h2><a href="guides.html">All ${cfg.guides.length} guides →</a></div>\n    <div class="feat">\n${cards}\n    </div>\n    `, s => s);

    // ItemList structured data mirrors the calculator list.
    const items = cfg.calculators.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[1], url: urlOf(c[0]) }));
    h = h.replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"ItemList"[\s\S]*?<\/script>/,
      () => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'PaisaTools calculators', itemListElement: items })}</script>`);
  }

  // 3g. Author box on the About page.
  if (name === 'about.html' && !isHi) {
    const bio = cfg.author.bio ? `<p>${esc(cfg.author.bio)}</p>` : '';
    h = block(h, 'author', `<p class="author-name"><strong>${esc(cfg.author.name)}</strong></p>${bio}`, s => s);
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
const rows = [];
const add = (loc, pr) => rows.push(`  <url><loc>${urlOf(loc)}</loc><lastmod>${dateFor(path.basename(loc) || 'index.html')}</lastmod><priority>${pr}</priority></url>`);
add('', '1.0');
cfg.calculators.forEach(c => add(c[0], '0.9'));
list.filter(f => !f.startsWith('hi/') && /^guide/.test(f)).forEach(f => add(f, '0.8'));
if (list.includes('hi/index.html')) add('hi/index.html', '0.8');
cfg.calculators.forEach(c => { if (fs.existsSync(path.join(root, 'hi', c[0]))) add('hi/' + c[0], '0.7'); });
cfg.legalPages.forEach(f => add(f, '0.3'));
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join('\n')}\n</urlset>\n`);

console.log(`synced ${list.length} pages (${changed} changed), sitemap has ${rows.length} URLs`);
const ph = Object.entries(cfg.author).filter(([k, v]) => /^AUTHOR_/.test(v)).map(([k]) => k);
if (ph.length) console.warn(`WARNING: author ${ph.join(', ')} still a placeholder in tools/site.config.js; fill it in before you publish.`);
