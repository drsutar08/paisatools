/*
 * Makes a 1200x630 sharing image for every calculator and guide (used by WhatsApp, X, LinkedIn previews)
 * and points each page's og:image / twitter:image at it. Needs Microsoft Edge or Google Chrome installed.
 *
 *   node tools/make-og.js            (only makes missing images)
 *   node tools/make-og.js --all      (remakes every image)
 *
 * Example numbers on the calculator cards are read from the tiles on index.html.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const cfg = require('./site.config.js');
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'og');
fs.mkdirSync(outDir, { recursive: true });

const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);
const browser = candidates.find(p => fs.existsSync(p));
if (!browser) { console.error('Could not find Edge or Chrome. Set BROWSER_PATH to its full path.'); process.exit(1); }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PASTEL = { loans: '#f5c6c6', tax: '#fbdcb8', save: '#c1f0dc', plan: '#d6d2fc', pink: '#f5c6c6', peach: '#fbdcb8', lav: '#d6d2fc', mint: '#c1f0dc', tint: '#e9ecf2' };

// Example inputs/results from the index.html tiles
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const tiles = {};
for (const m of index.matchAll(/<a class="tile"[^>]*href="([^"]+)"><span class="ico">[^<]*<\/span><h3>([^<]*)<\/h3><small>[^<]*<\/small><span class="eg"><span>([^<]*)<\/span><b>([^<]*)<\/b>/g)) tiles[m[1]] = { input: m[3], result: m[4] };

const page = ({ kicker, title, sub, color, big, small }) => `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap">
<style>
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#fff;font-family:"DM Sans","Segoe UI",Arial,sans-serif;color:#111827;display:grid;grid-template-columns:1.15fr .85fr;gap:36px;padding:56px 56px 56px 64px;overflow:hidden}
.l{display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:14px;font-weight:700;font-size:34px}.brand i{font-style:normal;width:52px;height:52px;border-radius:50%;background:#111827;color:#fff;display:grid;place-items:center;font-size:28px}
.k{display:inline-block;background:${color};padding:8px 18px;border-radius:99px;font-weight:600;font-size:24px;margin-bottom:22px}
h1{margin:0;font-weight:600;letter-spacing:-2px;line-height:1.04;font-size:${title.length > 38 ? 62 : 76}px}
p{margin:18px 0 0;font-size:28px;color:#5b6472;line-height:1.35}
.r{background:${color};border-radius:44px;padding:44px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.r small{font-size:26px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;opacity:.7}
.r b{font-size:${big.length > 12 ? 64 : 82}px;line-height:1.05;letter-spacing:-2px;font-weight:600}
.r span{font-size:26px;opacity:.8;line-height:1.35}
</style><body>
<div class="l"><div class="brand"><i>₹</i>paisatools</div>
<div><div class="k">${esc(kicker)}</div><h1>${esc(title)}</h1><p>${esc(sub)}</p></div></div>
<div class="r"><small>${esc(small[0])}</small><b>${esc(big)}</b><span>${esc(small[1])}</span></div></body>`;

const jobs = [];
for (const c of cfg.calculators) {
  const slug = c[0].replace('.html', ''), t = tiles[c[0]] || { input: '', result: 'Free' };
  jobs.push({ slug, files: [c[0], 'hi/' + c[0]], html: page({
    kicker: 'Free calculator', title: c[1].replace(/ Calculator$/, ''), sub: 'No sign-up. Works on any phone.', color: PASTEL[c[3]],
    big: t.result, small: ['Example', t.input] }) });
}
for (const g of cfg.guides) {
  const slug = g[0].replace('.html', '');
  const h1 = (fs.readFileSync(path.join(root, g[0]), 'utf8').match(/<h1[^>]*>([^<]*)<\/h1>/) || [, slug])[1].trim();
  jobs.push({ slug, files: [g[0]], html: page({
    kicker: 'Money guide · ' + g[1], title: h1, sub: 'Plain English, with a worked example.', color: PASTEL[g[2]],
    big: 'Read the guide', small: ['PaisaTools', 'Updated November 2026'] }) });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
const redo = process.argv.includes('--all');
const todo = jobs.filter(j => redo || !fs.existsSync(path.join(outDir, j.slug + '.png')));

function shot(job, i) {
  return new Promise(resolve => {
    const htmlFile = path.join(tmp, job.slug + '.html');
    fs.writeFileSync(htmlFile, job.html);
    const p = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--user-data-dir=' + path.join(tmp, 'u' + i),
      '--window-size=1200,630', '--virtual-time-budget=8000', '--screenshot=' + path.join(outDir, job.slug + '.png'),
      'file:///' + htmlFile.replace(/\\/g, '/')], { stdio: 'ignore' });
    const timer = setTimeout(() => p.kill(), 120000);
    p.on('exit', () => { clearTimeout(timer); resolve(); });
  });
}

(async () => {
  let next = 0;
  const worker = async n => { while (next < todo.length) { const i = next++; await shot(todo[i], n * 1000 + i); process.stdout.write('.'); } };
  await Promise.all([0, 1, 2, 3, 4, 5].map(worker));
  console.log(`\nmade ${todo.length} images in og/`);

  // Point every page at its image
  let patched = 0;
  const base = cfg.domain + 'og/';
  for (const j of jobs) for (const f of j.files) {
    const file = path.join(root, f);
    if (!fs.existsSync(file) || !fs.existsSync(path.join(outDir, j.slug + '.png'))) continue;
    let h = fs.readFileSync(file, 'utf8'); const before = h;
    h = h.replace(/(<meta property="og:image" content=")[^"]*/, '$1' + base + j.slug + '.png')
         .replace(/(<meta name="twitter:image" content=")[^"]*/, '$1' + base + j.slug + '.png');
    if (h !== before) { fs.writeFileSync(file, h); patched++; }
  }
  console.log('updated sharing image on', patched, 'pages');
  fs.rmSync(tmp, { recursive: true, force: true });
})();
