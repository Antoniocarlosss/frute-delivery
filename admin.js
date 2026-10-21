import {firebaseConfigured} from './firebase-config.js';
import {connect} from './firebase-client.js';
import {produtos} from './produtos.js';
import {validProduct} from './catalogo-dados.js';
const status=document.querySelector('#status'),section=document.querySelector('#admin');
const say=s=>status.textContent=s;
function input(form,label,name,value,type='text'){const l=document.createElement('label');l.textContent=label;const i=document.createElement('input');i.name=name;i.type=type;if(type==='checkbox')i.checked=Boolean(value);else i.value=value??'';if(type!=='checkbox'){i.required=true;i.maxLength=1000}l.append(i);form.append(l);return i}
if(!firebaseConfigured)say('Falta a configuração pública do Firebase. Consulte CONFIGURAR-FIREBASE.md.');
else boot().catch(()=>say('Falha ao conectar ao Firebase. Confira a configuração e a internet.'));
async function boot(){
 const {auth,db,authApi:A,dbApi:D}=await connect();let stop=()=>{};
 const fail=e=>say(`Não foi possível concluir (${e.code??'erro de conexão'}). Confira permissões e conexão.`);
 document.querySelector('#login').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),b=e.target.querySelector('button');b.disabled=true;try{await A.signInWithEmailAndPassword(auth,f.get('email'),f.get('password'));e.target.reset()}catch{say('Não foi possível entrar. Confira e-mail, senha e conexão.')}finally{b.disabled=false}};
 A.onAuthStateChanged(auth,async user=>{
  stop();section.hidden=true;document.querySelector('#login').hidden=false;
  if(!user){say('Entre com a conta administrativa autorizada.');return}
  try{
   const permission=await D.getDocFromServer(D.doc(db,'admins',user.uid));
   if(!permission.exists()||permission.data().enabled!==true){await A.signOut(auth);say('Conta sem acesso administrativo. Autorize o UID no console Firebase conforme o guia.');return}
   document.querySelector('#login').hidden=true;section.hidden=false;section.replaceChildren();
   const logout=document.createElement('button');logout.textContent='Sair';logout.onclick=()=>A.signOut(auth).catch(fail);section.append(logout);
   const title=document.createElement('h2');title.textContent='Produtos';section.append(title);
   const help=document.createElement('p');help.textContent='Alterações salvas aparecem no cardápio ao abrir ou atualizar a página. Preços em reais. Fotos por nome de arquivo ou link HTTPS.';section.append(help);
   const seed=document.createElement('button');seed.textContent='Cadastrar os 5 produtos iniciais';seed.className='secondary';seed.onclick=async()=>{seed.disabled=true;try{for(const p of produtos){const ref=D.doc(db,'products',p.id);await D.runTransaction(db,async t=>{if(!(await t.get(ref)).exists())t.set(ref,{...p,imagem:p.imagem??'',ativo:true})})}say('Produtos iniciais cadastrados; existentes preservados.')}catch(e){fail(e)}finally{seed.disabled=false}};section.append(seed);
   const add=document.createElement('button');add.textContent='+ Novo produto';section.append(add);
   const editor=document.createElement('div'),list=document.createElement('div');section.append(editor,list);
   const edit=p=>{editor.replaceChildren();const form=document.createElement('form');form.className='panel';editor.append(form);const heading=document.createElement('h3');heading.textContent=p?'Editar produto':'Novo produto';form.append(heading);
    input(form,'Nome','nome',p?.nome);input(form,'Descrição','descricao',p?.descricao);input(form,'Categoria','categoria',p?.categoria??'Cremes Gourmet');
    const image=input(form,'Foto: arquivo no GitHub ou link HTTPS (opcional)','imagem',p?.imagem);image.required=false;
    for(const size of ['400','500']){const i=input(form,`${size} ml — preço em R$`,'preco'+size,p?(p.precos[size]/100).toFixed(2):'','number');i.min='0.01';i.max='10000';i.step='0.01'}
    input(form,'Disponível no cardápio','ativo',p?p.ativo:true,'checkbox');
    const save=document.createElement('button');save.textContent='Salvar produto';form.append(save);
    const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancelar';cancel.className='secondary';cancel.onclick=()=>editor.replaceChildren();form.append(cancel);
    form.onsubmit=async e=>{e.preventDefault();const f=new FormData(form);const data={id:p?.id??crypto.randomUUID(),nome:f.get('nome').trim(),descricao:f.get('descricao').trim(),categoria:f.get('categoria').trim(),imagem:f.get('imagem').trim(),precos:{400:Math.round(Number(f.get('preco400'))*100),500:Math.round(Number(f.get('preco500'))*100)},ativo:f.has('ativo')};if(!validProduct(data)){say('Revise nome, categoria, preços e foto. Use apenas links HTTPS ou nomes simples de arquivos.');return}save.disabled=true;try{await D.setDoc(D.doc(db,'products',data.id),data);editor.replaceChildren();say('Produto salvo. Atualize o cardápio para ver a alteração.')}catch(e){fail(e);save.disabled=false}};
   };
   add.onclick=()=>edit(null);
   stop=D.onSnapshot(D.collection(db,'products'),snap=>{list.replaceChildren();snap.forEach(doc=>{const p={...doc.data(),id:doc.id};if(!validProduct(p))return;const card=document.createElement('article');card.className='panel cart-item';const name=document.createElement('h3');name.textContent=p.nome;card.append(name);const text=document.createElement('p');text.textContent=`${p.ativo?'Disponível':'Indisponível'} • 400 ml R$ ${(p.precos[400]/100).toFixed(2)} • 500 ml R$ ${(p.precos[500]/100).toFixed(2)}`;card.append(text);const button=document.createElement('button');button.textContent='Editar';button.onclick=()=>edit(p);card.append(button);list.append(card)})},fail);
   await storeSettings(section,D,db,fail);say('Acesso autorizado. Catálogo conectado ao Firebase.');
  }catch(e){fail(e)}
 });
}
async function storeSettings(section,D,db,fail){
 const snap=await D.getDocFromServer(D.doc(db,'publicSettings','store')),s=snap.exists()?snap.data():{};
 const heading=document.createElement('h2');heading.textContent='Loja e entrega';section.append(heading);
 const form=document.createElement('form');form.className='panel';section.append(form);
 input(form,'Loja aberta','aberta',s.aberta??false,'checkbox');input(form,'Nome da loja','nome',s.nome??'FRUTÊ');
 const w=input(form,'WhatsApp com país e DDD (somente números)','whatsapp',s.whatsapp??'5569992617094','tel');w.pattern='[0-9]{10,15}';
 const l=document.createElement('label');l.textContent='Áreas: uma por linha. Cidade;Bairro;Taxa em R$;Mínimo em R$;Prazo';const areas=document.createElement('textarea');areas.rows=6;areas.placeholder='Sua cidade;Seu bairro;5.00;20.00;40–60 min';areas.value=(s.areas??[]).map(a=>`${a.cidade};${a.bairro};${(a.taxa/100).toFixed(2)};${(a.minimo/100).toFixed(2)};${a.prazo}`).join('\n');l.append(areas);form.append(l);
 const save=document.createElement('button');save.textContent='Salvar configurações';form.append(save);
 form.onsubmit=async e=>{e.preventDefault();try{const f=new FormData(form);const parsed=areas.value.split('\n').filter(x=>x.trim()).map(line=>{const parts=line.split(';').map(x=>x.trim());if(parts.length!==5||!parts[0]||!parts[1]||!parts[4]||![parts[2],parts[3]].every(x=>/^\d+(?:[.,]\d{1,2})?$/.test(x)))throw Error();return {cidade:parts[0],bairro:parts[1],taxa:Math.round(Number(parts[2].replace(',','.'))*100),minimo:Math.round(Number(parts[3].replace(',','.'))*100),prazo:parts[4]}});if(parsed.length>100||parsed.some(a=>a.taxa>1000000||a.minimo>1000000)||new Set(parsed.map(a=>(a.cidade+'|'+a.bairro).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())).size!==parsed.length)throw Error();save.disabled=true;await D.setDoc(D.doc(db,'publicSettings','store'),{nome:f.get('nome').trim().slice(0,100),whatsapp:f.get('whatsapp'),aberta:f.has('aberta'),areas:parsed});say('Configurações salvas. Atualize a página do cliente para carregar.')}catch(e){if(e.code)fail(e);else say('Revise as áreas: cinco campos por linha, valores positivos ou zero, sem bairros duplicados.')}finally{save.disabled=false}};
 const note=document.createElement('p');note.textContent='Pedidos e Pix continuam indisponíveis. Os valores de entrega são estimativas até existir validação no servidor.';section.append(note);
}
