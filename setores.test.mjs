import test from 'node:test';
import assert from 'node:assert/strict';
import {setores,resumoEntrega,rotuloSetor} from './setores.js';
const settings={aberta:true,areas:[{cidade:'Jaru',bairro:'Setor 1',taxa:500,minimo:0,ativo:true},{cidade:'Jaru',bairro:'Setor 2',taxa:null,minimo:0},{cidade:'Jaru',bairro:'Savana Park',taxa:0,minimo:0},{cidade:'Jaru',bairro:'Setor 3',taxa:500,minimo:0,ativo:false}]};
test('dez setores pedidos',()=>{assert.equal(setores.length,10);assert.ok(setores.includes('Jardim Europa'));assert.ok(setores.includes('Setor 8'))});
test('taxa soma e distingue vazio de entrega grátis',()=>{assert.equal(resumoEntrega(settings,'Setor 1',7800).total,8300);assert.ok(resumoEntrega(settings,'Setor 2',7800).error);assert.equal(resumoEntrega(settings,'Savana Park',7800).taxa,0)});
test('setor desativado, loja fechada e setor inexistente bloqueiam estimativa',()=>{assert.ok(resumoEntrega(settings,'Setor 3',7800).error);assert.ok(resumoEntrega({...settings,aberta:false},'Setor 1',7800).error);assert.ok(resumoEntrega(settings,'Outro',7800).error)});
test('opções exibem o preço salvo e não inventam taxas',()=>{assert.match(rotuloSetor(settings,'Setor 1'),/Setor 1 — entrega R\$\s5,00/);assert.equal(rotuloSetor(settings,'Setor 2'),'Setor 2 — taxa a confirmar');assert.equal(rotuloSetor(settings,'Savana Park'),'Savana Park — entrega grátis');assert.equal(rotuloSetor(settings,'Setor 3'),'Setor 3 — entrega indisponível')});
