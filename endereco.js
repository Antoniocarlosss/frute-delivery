import {setores,areaDoSetor,resumoEntrega,normalizar,rotuloSetor} from './setores.js?v=15';
import {dinheiro} from './produtos.js?v=15';
export function instalarEndereco(form,settings,subtotal){
 const old=form.elements.bairro,street=form.elements.rua,city=form.elements.cidade,num=form.elements.numero;
 const select=document.createElement('select');select.name='bairro';select.required=true;
 const label=old.closest('label');const current=old.value;label.firstChild.textContent='Setor de entrega';
 select.add(new Option('Selecione o setor e veja a entrega',''));for(const s of setores){const option=new Option(rotuloSetor(settings,s),s);option.disabled=areaDoSetor(settings,s)?.ativo===false;select.add(option)}if(current&&!setores.includes(current))select.add(new Option(current,current));select.value=current;old.replaceWith(select);
 city.value='Jaru';city.readOnly=true;num.inputMode='numeric';num.autocomplete='address-line2';num.placeholder='Digite o número da casa';
 street.autocomplete='off';street.placeholder='Digite a rua ou avenida';
 const quote=document.createElement('div');quote.className='notice';quote.setAttribute('role','status');label.after(quote);
 function update(){const q=resumoEntrega(settings,select.value,subtotal);quote.textContent=q.error??`Entrega: ${dinheiro(q.taxa)} • Total estimado: ${dinheiro(q.total)} • ${q.prazo}`}
 const suggestions=document.createElement('div');suggestions.className='street-suggestions';street.after(suggestions);
 const status=document.createElement('p');status.className='muted';status.setAttribute('role','status');street.closest('label').append(status);
 let timer,revision=0,controller;
 const message='';
 const apply=item=>{revision++;controller?.abort();street.value=item.logradouro;suggestions.replaceChildren();status.textContent='Rua preenchida. Confira o setor e o número da casa.'};
 function show(items){suggestions.replaceChildren();for(const item of items.slice(0,10)){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=`${item.logradouro}${item.bairro?' • '+item.bairro:''}`;b.onclick=()=>apply(item);suggestions.append(b)}}
 select.onchange=()=>{revision++;controller?.abort();suggestions.replaceChildren();update();if(street.value.length>=3)search()};
 async function search(){const r=++revision;controller?.abort();const query=street.value.trim();if(query.length<3){suggestions.replaceChildren();status.textContent='Digite pelo menos 3 letras para buscar ruas de Jaru.';return}
  const local=(areaDoSetor(settings,select.value)?.ruas??[]).filter(x=>normalizar(x).includes(normalizar(query))).map(x=>({logradouro:x}));show(local);status.textContent='Buscando ruas de Jaru…';controller=new AbortController();const requestController=controller;const timeout=setTimeout(()=>requestController.abort(),8000);
  try{const res=await fetch(`https://viacep.com.br/ws/RO/Jaru/${encodeURIComponent(query)}/json/`,{signal:requestController.signal});if(!res.ok)throw Error();const data=await res.json();if(r!==revision||!street.isConnected)return;const rows=Array.isArray(data)?data.filter(x=>x.uf==='RO'&&normalizar(x.localidade)==='jaru'&&x.logradouro):[];const seen=new Set(local.map(x=>x.logradouro));show([...local,...rows.filter(x=>!seen.has(x.logradouro))]);status.textContent=message}catch{if(r===revision&&street.isConnected)status.textContent='Busca indisponível. Você pode digitar o endereço manualmente.'}finally{clearTimeout(timeout)}
 }
 street.oninput=()=>{revision++;controller?.abort();clearTimeout(timer);suggestions.replaceChildren();timer=setTimeout(search,650)};
 const privacy=document.createElement('p');privacy.className='muted';privacy.textContent='A busca consulta o ViaCEP usando apenas o nome da rua e a cidade. Nome, telefone e número da casa não são enviados a esse serviço.';form.append(privacy);update();status.textContent=message;
}
