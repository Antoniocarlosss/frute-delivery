import {painelPedidos} from './pedidos-admin.js?v=9';
import {configurarEntrega} from './entrega-admin.js?v=9';
import {firebaseConfigured} from './firebase-config.js?v=9';
import {connect} from './firebase-client.js?v=9';
import {produtos} from './produtos.js?v=9';
import {validProduct} from './catalogo-dados.js?v=9';
import {prepararFoto} from './foto-produto.js?v=9';
const status=document.querySelector('#status'),section=document.querySelector('#admin');
const say=s=>status.textContent=s;
function input(form,label,name,value,type='text'){const l=document.createElement('label');l.textContent=label;const i=document.createElement('input');i.name=name;i.type=type;if(type==='checkbox')i.checked=Boolean(value);else i.value=value??'';if(type!=='checkbox'){i.required=true;i.maxLength=1000}l.append(i);form.append(l);return i}
if(!firebaseConfigured)say('Falta a configuração pública do Firebase. Consulte CONFIGURAR-FIREBASE.md.');
else boot().catch(()=>say('Falha ao conectar ao Firebase. Confira a configuração e a internet.'));
async function boot(){
 const {auth,db,authApi:A,dbApi:D}=await connect();let stop=()=>{},stopOrders=()=>{};
 const fail=e=>say(`Não foi possível concluir (${e.code??'erro de conexão'}). Confira permissões e conexão.`);
 document.querySelector('#login').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),b=e.target.querySelector('button');b.disabled=true;try{await A.signInWithEmailAndPassword(auth,f.get('email'),f.get('password'));e.target.reset()}catch{say('Não foi possível entrar. Confira e-mail, senha e conexão.')}finally{b.disabled=false}};
 A.onAuthStateChanged(auth,async user=>{
  stop();stopOrders();section.hidden=true;document.querySelector('#login').hidden=false;
  if(!user){say('Entre com a conta administrativa autorizada.');return}
  try{
   const permission=await D.getDocFromServer(D.doc(db,'admins',user.uid));
   if(!permission.exists()||permission.data().enabled!==true){await A.signOut(auth);say('Conta sem acesso administrativo. Autorize o UID no console Firebase conforme o guia.');return}
   document.querySelector('#login').hidden=true;section.hidden=false;section.replaceChildren();
   const logout=document.createElement('button');logout.textContent='Sair';logout.onclick=()=>A.signOut(auth).catch(fail);section.append(logout);
   const title=document.createElement('h2');title.textContent='Produtos';section.append(title);
   const help=document.createElement('p');help.textContent='Alterações salvas aparecem no cardápio ao abrir ou atualizar a página. Preços em reais. Adicione fotos direto da sua galeria.';section.append(help);
   const seed=document.createElement('button');seed.textContent='Cadastrar os 5 produtos iniciais';seed.className='secondary';seed.onclick=async()=>{seed.disabled=true;try{for(const p of produtos){const ref=D.doc(db,'products',p.id);await D.runTransaction(db,async t=>{if(!(await t.get(ref)).exists())t.set(ref,{...p,imagem:p.imagem??'',ativo:true})})}say('Produtos iniciais cadastrados; existentes preservados.')}catch(e){fail(e)}finally{seed.disabled=false}};section.append(seed);
   const add=document.createElement('button');add.textContent='+ Novo produto';section.append(add);
   const editor=document.createElement('div'),list=document.createElement('div');section.append(editor,list);
   const edit=p=>{editor.replaceChildren();const form=document.createElement('form');form.className='panel';editor.append(form);const heading=document.createElement('h3');heading.textContent=p?'Editar produto':'Novo produto';form.append(heading);
    input(form,'Nome','nome',p?.nome);input(form,'Descrição','descricao',p?.descricao);input(form,'Categoria','categoria',p?.categoria??'Cremes Gourmet');
    let imagem=p?.imagem??'',processing=false,photoRevision=0;
    const photoBox=document.createElement('div');photoBox.className='photo-editor';form.append(photoBox);
    const preview=document.createElement('img');preview.alt='Prévia da foto do produto';preview.hidden=!imagem;if(imagem)preview.src=imagem;photoBox.append(preview);
    const hint=document.createElement('p');hint.textContent='Uma boa foto dá vontade de experimentar. Escolha da sua galeria.';photoBox.append(hint);
    const file=document.createElement('input');file.type='file';file.accept='image/jpeg,image/png,image/webp';file.id='foto-'+(p?.id??'novo');file.className='photo-input';photoBox.append(file);
    const choose=document.createElement('label');choose.htmlFor=file.id;choose.className='button';choose.textContent='＋ Adicionar ou trocar foto';photoBox.append(choose);
    const feedback=document.createElement('p');feedback.setAttribute('role','status');photoBox.append(feedback);
    const remove=document.createElement('button');remove.type='button';remove.className='secondary';remove.textContent='Remover foto';remove.onclick=()=>{photoRevision++;processing=false;imagem='';preview.removeAttribute('src');preview.hidden=true;file.value='';feedback.textContent='Foto removida. Clique em Salvar produto para confirmar.'};photoBox.append(remove);
    file.onchange=async()=>{const selected=file.files[0];if(!selected)return;const revision=++photoRevision;processing=true;feedback.textContent='Preparando sua foto…';try{const result=await prepararFoto(selected);if(revision!==photoRevision)return;imagem=result;preview.src=imagem;preview.hidden=false;feedback.textContent='Foto pronta! Clique em Salvar produto.'}catch(e){if(revision===photoRevision)feedback.textContent=e.message}finally{if(revision===photoRevision)processing=false;file.value=''}};
    for(const size of ['400','500']){const i=input(form,`${size} ml — preço em R$`,'preco'+size,p?(p.precos[size]/100).toFixed(2):'','number');i.min='0.01';i.max='10000';i.step='0.01'}
    input(form,'Disponível no cardápio','ativo',p?p.ativo:true,'checkbox');
    const save=document.createElement('button');save.textContent='Salvar produto';form.append(save);
    const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';cancel.className='secondary';cancel.onclick=()=>editor.replaceChildren();form.append(cancel);
    form.onsubmit=async e=>{e.preventDefault();if(processing){feedback.textContent='Aguarde a foto terminar de carregar.';return}const f=new FormData(form);const data={id:p?.id??crypto.randomUUID(),nome:f.get('nome').trim(),descricao:f.get('descricao').trim(),categoria:f.get('categoria').trim(),imagem,precos:{400:Math.round(Number(f.get('preco400'))*100),500:Math.round(Number(f.get('preco500'))*100)},ativo:f.has('ativo')};if(!validProduct(data)){say('Revise nome, categoria, preços e foto.');return}save.disabled=true;try{await D.setDoc(D.doc(db,'products',data.id),data);editor.replaceChildren();say('Produto salvo. Atualize o cardápio para ver a alteração.')}catch(e){fail(e);save.disabled=false}};
   };
   add.onclick=()=>edit(null);
   stop=D.onSnapshot(D.collection(db,'products'),snap=>{list.replaceChildren();snap.forEach(doc=>{const p={...doc.data(),id:doc.id};if(!validProduct(p))return;const card=document.createElement('article');card.className='panel cart-item';const name=document.createElement('h3');name.textContent=p.nome;card.append(name);const text=document.createElement('p');text.textContent=`${p.ativo?'Disponível':'Indisponível'} • 400 ml R$ ${(p.precos[400]/100).toFixed(2)} • 500 ml R$ ${(p.precos[500]/100).toFixed(2)}`;card.append(text);const button=document.createElement('button');button.textContent='Editar';button.onclick=()=>edit(p);card.append(button);const remove=document.createElement('button');remove.className='secondary danger';remove.textContent='Excluir produto';remove.onclick=async()=>{if(!window.confirm('Excluir o produto "'+p.nome+'"? Esta ação não pode ser desfeita.'))return;remove.disabled=true;try{await D.deleteDoc(D.doc(db,'products',p.id));say('Produto excluído. Atualize o cardápio para ver a alteração.')}catch(e){fail(e);remove.disabled=false}};card.append(remove);list.append(card)})},fail);
   stopOrders=painelPedidos(section,D,db,say);await configurarEntrega(section,D,db,fail,say);say('Acesso autorizado. Catálogo conectado ao Firebase.');
  }catch(e){fail(e)}
 });
}
