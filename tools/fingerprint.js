/*
 * A fingerprint of a page's own content, used to give each page a real "last modified" date.
 * It covers the title, the meta description, the main content and the page's inline scripts (the calculator code).
 * It leaves out everything tools/sync.js rebuilds on every page (menu, footer, related box, breadcrumbs, byline,
 * official sources, guide links, hreflang and structured data), so adding a calculator to the site
 * doesn't make every page look changed. The homepage lists of calculators and guides do count.
 */
const crypto = require('crypto');

module.exports = function fingerprint(html) {
  const head = html.split('</head>')[0];
  const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  let main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [])[1] || '';
  main = main
    .replace(/<!--(crumbs|byline|sources|home-author)-->[\s\S]*?<!--\/\1-->/g, '')
    .replace(/<nav class="crumbs?"[\s\S]*?<\/nav>/g, '')
    .replace(/<p class="byline">[\s\S]*?<\/p>/g, '')
    .replace(/<section class="sources"[\s\S]*?<\/section>/g, '')
    .replace(/<div class="related">[\s\S]*?<\/div>/g, '')
    .replace(/<p class="calc-links">[\s\S]*?<\/p>/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    // ad slots move around without the content changing
    .replace(/<div class="ad-slot"[\s\S]*?<\/ins>\s*<script>[\s\S]*?<\/script>\s*<\/div>/g, '')
    .replace(/<div class="pt-banner"[^>]*><\/div>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const body = html.split('</main>')[1] || '';
  const scripts = [...body.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  // Ignore differences that are only whitespace, ".html" in links, or the "../" prefix sync adds or removes.
  const norm = s => s.replace(/\.html(?=["#])/g, '').replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha1').update([title, desc, norm(main), norm(scripts)].join('\u0000')).digest('hex').slice(0, 16);
};
