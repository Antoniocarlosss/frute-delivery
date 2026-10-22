import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,serverTimestamp,collection,query,where,getDocs,writeBatch} from 'firebase/firestore';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const env=await initializeTestEnvironment({projectId:'demo-frute',firestore:{host:'127.0.0.1',port:8087,rules:fs.readFileSync(new URL('./firestore.rules',import.meta.url),'utf8')}});
const db=env.authenticatedContext('cliente-1',{firebase:{sign_in_provider:'anonymous'}}).firestore();
const other=env.authenticatedContext('cliente-2',{firebase:{sign_in_provider:'anonymous'}}).firestore();
const admin=env.authenticatedContext('admin-1').firestore();
const anon=env.unauthenticatedContext().firestore();
const id='11111111-1111-4111-8111-111111111111';
const store={aberta:true,nome:'Frute',whatsapp:'5569992617094',areas:[{cidade:'Jaru',bairro:'Setor 1',ativo:true,taxa:500,minimo:0}]};
const order=(items=[{productId:'p0',nome:'Produto 0',size:'400',qty:2,unit:2500,note:''}])=>({customerUid:'cliente-1',customer:{nome:'Cliente Teste',telefone:'69999999999',rua:'Rua Teste',numero:'123',bairro:'Setor 1',cidade:'Jaru',complemento:'',referencia:''},items,areaIndex:0,subtotal:items.reduce((s,i)=>s+i.qty*i.unit,0),delivery:500,total:items.reduce((s,i)=>s+i.qty*i.unit,0)+500,status:'recebido',payment:'nao_cobrado',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
async function saveOrder(ref,value){const batch=writeBatch(ref.firestore);batch.set(ref,value);value.items.forEach((item,index)=>batch.set(doc(ref.firestore,ref.path,'lines',String(index)),item));return batch.commit()}
let n=0;async function check(name,fn){await fn();n++;console.log('PASS '+name)}
try{
 await env.clearFirestore();await env.withSecurityRulesDisabled(async ctx=>{const db=ctx.firestore();await setDoc(doc(db,'publicSettings/store'),store);await setDoc(doc(db,'admins/admin-1'),{enabled:true});for(let i=0;i<9;i++)await setDoc(doc(db,'products/p'+i),{id:'p'+i,nome:'Produto '+i,ativo:true,precos:{400:2500,500:3000}})});
 const ref=doc(db,'orders',id);
 await check('cliente cria pedido válido',()=>assertSucceeds(saveOrder(ref,order())));
 await check('cliente lê seu pedido',()=>assertSucceeds(getDoc(ref)));
 await check('outro cliente não lê pedido',()=>assertFails(getDoc(doc(other,'orders',id))));
 await check('sem autenticação não lê pedido',()=>assertFails(getDoc(doc(anon,'orders',id))));
 await check('consulta por proprietário funciona',async()=>{const snap=await assertSucceeds(getDocs(query(collection(db,'orders'),where('customerUid','==','cliente-1'))));assert.equal(snap.size,1)});
 await check('preço adulterado é rejeitado',()=>assertFails(saveOrder(doc(db,'orders','22222222-2222-4222-8222-222222222222'),order([{productId:'p0',nome:'Produto 0',size:'400',qty:1,unit:1,note:''}]))));
 await check('taxa adulterada é rejeitada',()=>assertFails(saveOrder(doc(db,'orders','22222222-2222-4222-8222-222222222222'),{...order(),delivery:0,total:5000})));
 await check('pagamento inventado é rejeitado',()=>assertFails(saveOrder(doc(db,'orders','22222222-2222-4222-8222-222222222222'),{...order(),payment:'pago'})));
 await check('cliente não altera andamento',()=>assertFails(updateDoc(ref,{status:'entregue',updatedAt:serverTimestamp()})));
 await check('repetir gravação não sobrescreve pedido',()=>assertFails(saveOrder(ref,order())));
 await check('admin atualiza preparação',()=>assertSucceeds(updateDoc(doc(admin,'orders',id),{status:'preparando',updatedAt:serverTimestamp()})));
 await check('admin não altera pagamento',()=>assertFails(updateDoc(doc(admin,'orders',id),{payment:'pago',updatedAt:serverTimestamp()})));
 await check('pular etapa é rejeitado',()=>assertFails(updateDoc(doc(admin,'orders',id),{status:'entregue',updatedAt:serverTimestamp()})));
 await check('oito produtos distintos ficam dentro do limite de regras',()=>assertSucceeds(saveOrder(doc(db,'orders','33333333-3333-4333-8333-333333333333'),order(Array.from({length:8},(_,i)=>({productId:'p'+i,nome:'Produto '+i,size:'400',qty:1,unit:2500,note:''}))))));
 await check('nove linhas são rejeitadas',()=>assertFails(saveOrder(doc(db,'orders','44444444-4444-4444-8444-444444444444'),order(Array.from({length:9},(_,i)=>({productId:'p'+i,nome:'Produto '+i,size:'400',qty:1,unit:2500,note:''}))))));
 await env.withSecurityRulesDisabled(ctx=>updateDoc(doc(ctx.firestore(),'publicSettings/store'),{aberta:false}));
 await check('loja fechada rejeita pedido',()=>assertFails(saveOrder(doc(db,'orders','55555555-5555-4555-8555-555555555555'),order())));
 console.log(n+' testes de regras passaram.');
}finally{await env.cleanup()}
