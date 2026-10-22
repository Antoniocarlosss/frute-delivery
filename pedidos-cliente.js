import {normalizarTelefone} from './telefone.js?v=15';
import {firebaseConfig} from './firebase-config.js?v=15';
import {dinheiro} from './produtos.js?v=15';
import {escapeHtml as esc} from './catalogo-dados.js?v=15';
import {normalizar} from './setores.js?v=15';
export const estados={recebido:'Pedido recebido',preparando:'Em preparação',saiu:'Saiu para entrega',entregue:'Entregue',cancelado:'Cancelado'};
let connection,stop=()=>{};
export function pararPedidos(){stop();stop=()=>{}}
export async function customer(){return connection??=Promise.all(['app','auth','firestore'].map(s=>import(`https://www.gstatic.com/firebasejs/13.0.0/firebase-${s}.js`))).then(async([A,B,D])=>{const app=A.getApps().find(a=>a.name==='cliente')??A.initializeApp(firebaseConfig,'cliente');const auth=B.getAuth(app);await auth.authStateReady();if(!auth.currentUser)await B.signInAnonymously(auth);return {db:D.getFirestore(app),D,user:auth.currentUser}}).catch(e=>{connection=null;throw e})}
export async function enviarPedido(cart,profile,expectedTotal){
 if(cart.length<1||cart.length>8)throw Error('Use até 8 linhas de produtos por pedido.');
 const phone=normalizarTelefone(profile.telefone);if(!phone)throw Error('Informe seu WhatsApp com DDD no campo da confirmação.');
 const {D,db,user}=await customer();
 // Mesma tentativa conserva o ID, mesmo se a resposta de rede se perder.
 const fingerprint=JSON.stringify({cart,profile});let pending;
 try{pending=JSON.parse(localStorage.getItem('frute-pending-order'))}catch{}
 if(!pending||pending.fingerprint!==fingerprint||pending.uid!==user.uid){pending={id:crypto.randomUUID(),uid:user.uid,fingerprint};localStorage.setItem('frute-pending-order',JSON.stringify(pending))}
 const ref=D.doc(db,'orders',pending.id),existing=await D.getDocFromServer(ref).catch(e=>{if(e.code==='permission-denied')return null;throw e});
 if(existing?.exists())return {id:existing.id,...existing.data()};
 const store=await D.getDocFromServer(D.doc(db,'publicSettings','store'));const s=store.data();if(!s?.aberta)throw Error('A loja está fechada.');
 const areaIndex=s.areas.findIndex(a=>normalizar(a.cidade)===normalizar(profile.cidade)&&normalizar(a.bairro)===normalizar(profile.bairro));const area=s.areas[areaIndex];if(!area||area.ativo===false||!Number.isSafeInteger(area.taxa)||area.taxa<0)throw Error('Entrega não configurada para o setor selecionado.');
 const items=await Promise.all(cart.map(async x=>{const p=(await D.getDocFromServer(D.doc(db,'products',x.id))).data();if(!p?.ativo||!p.precos?.[x.size])throw Error('Um produto ficou indisponível. Atualize o cardápio.');return {productId:x.id,nome:p.nome,size:String(x.size),qty:x.qty,unit:p.precos[x.size],note:String(x.note??'').slice(0,300)}}));
 const subtotal=items.reduce((s,x)=>s+x.unit*x.qty,0);if(subtotal<(area.minimo??0))throw Error('Pedido abaixo do mínimo permitido para o setor.');
 if(subtotal+area.taxa!==expectedTotal)throw Error('Os preços ou a entrega mudaram. Atualize a página e revise o total antes de confirmar.');
 const order={customerUid:user.uid,customer:{nome:profile.nome,telefone:phone,rua:profile.rua,numero:profile.numero,bairro:area.bairro,cidade:area.cidade,complemento:profile.complemento??'',referencia:profile.referencia??''},items,areaIndex,subtotal,delivery:area.taxa,total:subtotal+area.taxa,status:'recebido',payment:'nao_cobrado',createdAt:D.serverTimestamp(),updatedAt:D.serverTimestamp()};
 const batch=D.writeBatch(db);batch.set(ref,order);items.forEach((item,index)=>batch.set(D.doc(db,'orders',pending.id,'lines',String(index)),item));await batch.commit();return {id:pending.id,...order};
}
export function concluirTentativa(){localStorage.removeItem('frute-pending-order');localStorage.setItem('frute-order-alerts','true')}
export async function mostrarPedidos(app){
 pararPedidos();app.innerHTML='<section class="narrow"><h1>Meus pedidos</h1><p>Carregando…</p></section>';
 try{const {D,db,user}=await customer();if(!app.isConnected||location.hash!=='#pedidos')return;stop=D.onSnapshot(D.query(D.collection(db,'orders'),D.where('customerUid','==',user.uid),D.limit(100)),snap=>{if(location.hash!=='#pedidos')return;const docs=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds??0)-(a.createdAt?.seconds??0));app.innerHTML=`<section class="narrow"><h1>Meus pedidos</h1><p class="muted">Acesso disponível neste navegador. Ao apagar os dados do navegador ou trocar de aparelho, o histórico não é recuperado automaticamente. Exibindo até 100 pedidos.</p>${docs.length?docs.map(o=>`<article class="panel cart-item"><h3>Pedido ${esc(o.id.slice(0,8).toUpperCase())}</h3><p class="tag">${esc(estados[o.status]??o.status)}</p>${o.items.map(i=>`<p>${i.qty}× ${esc(i.nome)} • ${esc(i.size)} ml</p>`).join('')}<p>Entrega: ${dinheiro(o.delivery)}</p><p class="price">Total: ${dinheiro(o.total)}</p><p class="muted">Pagamento não cobrado pelo aplicativo. Combine com a loja.</p></article>`).join(''):'<p>Você ainda não enviou pedidos.</p>'}</section>`},()=>{app.innerHTML='<p class="notice">Não foi possível carregar os pedidos. Confira a conexão e tente novamente.</p>'})}catch{app.innerHTML='<p class="notice">Não foi possível acessar os pedidos. Confira se a autenticação Anônima está ativada no Firebase e se as regras foram publicadas.</p>'}
}
