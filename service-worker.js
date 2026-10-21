const CACHE='frute-static-setores-v5';
const FILES=['./','./index.html','./style.css','./app.js','./setores.js','./endereco.js','./firebase-client.js','./firebase-config.js','./catalogo-dados.js','./produtos.js','./manifest.json','./icon.svg','./creme-ninho.png','./creme-maracuja.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frute-static-')&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(!FILES.some(f=>new URL(f,self.registration.scope).href===e.request.url))return;e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
