/*
 * Small local web server for previewing the site, with the same clean addresses as GitHub Pages
 * (/emi-calculator instead of /emi-calculator.html). No installs needed.
 *
 *   node tools/serve.js            then open http://localhost:8080/
 *   node tools/serve.js 3000       to use another port
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = parseInt(process.argv.find(a => /^\d+$/.test(a)), 10) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, '');
  const base = path.join(root, clean);
  if (!base.startsWith(root)) return null;                         // stay inside the site folder
  const tries = [base, base + '.html', path.join(base, 'index.html')];
  return tries.find(f => fs.existsSync(f) && fs.statSync(f).isFile()) || null;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];
  let file = resolve(urlPath);
  let status = 200;
  if (!file) { file = path.join(root, '404.html'); status = 404; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); res.end('Server error'); return; }
    res.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});

// If the port is busy, try the next few
function start(p, tries) {
  server.once('error', e => {
    if (e.code === 'EADDRINUSE' && tries > 0) start(p + 1, tries - 1);
    else { console.error('Could not start the server:', e.message); process.exit(1); }
  });
  server.listen(p, () => {
    const url = 'http://localhost:' + p + '/';
    console.log('PaisaTools is running at ' + url + '   (press Ctrl+C to stop)');
    if (process.argv.includes('--open') && process.platform === 'win32') require('child_process').exec('start "" ' + url);
  });
}
start(port, 10);
