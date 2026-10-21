const CACHE='frute-static-entrega-v6';
const FILES=["./","./index.html","./style.css?v=6","./manifest.json","./icon.svg","./creme-ninho.png","./creme-maracuja.png","./admin.js?v=6","./app.js?v=6","./catalogo-dados.js?v=6","./endereco.js?v=6","./entrega-admin.js?v=6","./firebase-client.js?v=6","./firebase-config.js?v=6","./foto-produto.js?v=6","./produtos.js?v=6","./setores.js?v=6"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('frute-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(!FILES.some(f=>new URL(f,self.registration.scope).href===e.request.url))return;e.respondWith(fetch(e.request,{cache:'no-cache'}).catch(()=>caches.match(e.request)))});
