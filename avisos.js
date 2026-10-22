import {customer,estados} from './pedidos-cliente.js?v=15';
import {mudancasDeStatus} from './avisos-estado.js?v=15';
let started=false;
export async function iniciarAvisos(force=false){
 if(started||(!force&&localStorage.getItem('frute-order-alerts')!=='true'))return;started=true;
 const box=document.createElement('aside');box.className='order-alerts';box.setAttribute('aria-label','Avisos dos pedidos');
 const button=document.createElement('button');button.className='secondary';button.textContent='🔔 Ativar notificações dos pedidos';box.append(button);
 const info=document.createElement('p');info.className='muted';info.textContent='Avisos enquanto esta loja estiver aberta em uma aba. No celular, o navegador pode suspender a aba em segundo plano.';box.append(info);
 const message=document.createElement('p');message.setAttribute('role','status');message.setAttribute('aria-live','polite');box.append(message);document.querySelector('header').after(box);
 button.onclick=async()=>{if(!('Notification'in window)){info.textContent='Este navegador não oferece notificações. Os avisos aparecerão aqui na loja.';return}try{const permission=await Notification.requestPermission();info.textContent=permission==='granted'?'Notificações permitidas. Mantenha a loja aberta em uma aba.':'Os avisos continuam dentro da loja. Para permitir notificações, confira as permissões do navegador.';button.textContent=permission==='granted'?'🔔 Notificações permitidas':'🔔 Permitir notificações'}catch{info.textContent='Não foi possível ativar. Os avisos continuam dentro da loja.'}};
 if('Notification'in window&&Notification.permission==='granted')button.textContent='🔔 Notificações permitidas';
 try{const {D,db,user}=await customer();localStorage.setItem('frute-order-alerts','true');const key='frute-status-'+user.uid;
 D.onSnapshot(D.query(D.collection(db,'orders'),D.where('customerUid','==',user.uid),D.limit(100)),snap=>{
  if(snap.metadata.fromCache)return;
  let previous={};try{previous=JSON.parse(localStorage.getItem(key))??{}}catch{}
  const orders=snap.docs.map(d=>({id:d.id,status:d.data().status}));const changed=mudancasDeStatus(previous,orders);
  for(const o of orders)previous[o.id]=o.status;try{localStorage.setItem(key,JSON.stringify(previous))}catch{}
  for(const o of changed){const text=`Pedido ${o.id.slice(0,8).toUpperCase()}: ${estados[o.status]??o.status}`;message.textContent=text;const a=document.createElement('a');a.href='#pedidos';a.textContent=' Ver pedido';message.append(a);
   if('Notification'in window&&Notification.permission==='granted'&&'serviceWorker'in navigator){navigator.serviceWorker.getRegistration().then(reg=>reg?.showNotification('FRUTÊ • Atualização do pedido',{body:text,tag:'frute-'+o.id+'-'+o.status,icon:'icon.svg',data:{url:new URL('./index.html#pedidos',location.href).href}})).catch(()=>{})}
  }
 },()=>{info.textContent='Acompanhamento desconectado. Confira a internet e atualize a página.'});
 }catch{started=false;info.textContent='Não foi possível ativar o acompanhamento. Atualize a página para tentar novamente.';box.remove()}
}
