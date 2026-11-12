const CACHE='drivertalk-carletti-v113';
const ASSETS=['./','./index.html','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('drivertalk-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
   if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)))}return r;
  }).catch(()=>caches.match('./index.html')));return;
 }
 // Konfigurationsfilen læses altid frisk, når der er netforbindelse.
 if(new URL(e.request.url).pathname.endsWith('/config.js')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));return;
 }
 e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
});
