import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {produtos,dinheiro} from './produtos.js';
test('preços oficiais e tamanhos',()=>{assert.deepEqual(produtos.map(p=>Object.values(p.precos)),[[2500,3000],[2200,2800],[2200,2800],[2500,3000],[2800,3200]]);assert.equal(new Set(produtos.map(p=>p.id)).size,5)});
test('pedido de exemplo soma R$ 78',()=>{assert.equal(produtos[0].precos[400]*2+produtos[1].precos[500],7800);assert.match(dinheiro(7800),/78,00/)});
test('recursos de publicação existem',async()=>{for(const p of ['index.html','admin.html','style.css','app.js','admin.js','firebase-config.js','manifest.json','icon.svg',...produtos.filter(p=>p.imagem).map(p=>p.imagem)])await access(new URL('./'+p,import.meta.url));const m=JSON.parse(await readFile(new URL('./manifest.json',import.meta.url)));assert.equal(m.start_url,'./index.html')});
