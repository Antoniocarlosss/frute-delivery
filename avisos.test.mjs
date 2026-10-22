import test from 'node:test';import assert from 'node:assert/strict';import {mudancasDeStatus} from './avisos-estado.js';
test('primeira leitura não dispara aviso de pedidos antigos',()=>assert.deepEqual(mudancasDeStatus({},[{id:'1',status:'entregue'}]),[]));
test('mudanças disparam e repetição não dispara',()=>{assert.deepEqual(mudancasDeStatus({'1':'recebido'},[{id:'1',status:'preparando'}]),[{id:'1',status:'preparando'}]);assert.deepEqual(mudancasDeStatus({'1':'preparando'},[{id:'1',status:'preparando'}]),[])});
test('cada mudança inclusive cancelamento gera aviso',()=>{for(const [a,b] of [['recebido','preparando'],['preparando','saiu'],['saiu','entregue'],['recebido','cancelado']])assert.equal(mudancasDeStatus({'1':a},[{id:'1',status:b}]).length,1)});
