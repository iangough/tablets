// Tablets service worker: the app opens with no internet. Page = stale-while-revalidate (new version shows on the next open).
const CACHE='tablets-2026-11-23i';
const SHELL=['./','index.html','sos.html','manifest.webmanifest','manifest-sos.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-sos-192.png','icon-sos-512.png','icon-sos-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net;
  }));
});
