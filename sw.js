/* PaisaTools service worker: pages work offline after the first visit. */
const CACHE='paisatools-v5';
const CORE=['./','index.html','theme.css','calc-base.css','calc-common.js','site.js','manifest.webmanifest','offline.html'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin) return;
  // Pages: try the network first so updates show up, fall back to the cache offline.
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r;})
      .catch(()=>caches.match(req).then(r=>r||caches.match('offline.html'))));
    return;
  }
  // Static files: cache first.
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));return r;})));
});
