const CACHE='frute-static-simples-v8';
const FILES=["./","./index.html","./style.css?v=8","./manifest.json","./icon.svg","./creme-ninho.png","./creme-maracuja.png","./admin.js?v=8","./app.js?v=8","./catalogo-dados.js?v=8","./endereco.js?v=8","./entrega-admin.js?v=8","./firebase-client.js?v=8","./firebase-config.js?v=8","./foto-produto.js?v=8","./produtos.js?v=8","./setores.js?v=8"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frute-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(!FILES.some(f=>new URL(f,self.registration.scope).href===e.request.url))return;e.respondWith(fetch(e.request,{cache:'no-cache'}).catch(()=>caches.match(e.request)))});
