import {setores,areaDoSetor,resumoEntrega,normalizar,rotuloSetor} from './setores.js?v=6';
import {dinheiro} from './produtos.js?v=6';
export function instalarEndereco(form,settings,subtotal){
 const old=form.elements.bairro,street=form.elements.rua,cep=form.elements.cep,city=form.elements.cidade,num=form.elements.numero;
 const select=document.createElement('select');select.name='bairro';select.required=true;
 const label=old.closest('label');const current=old.value;label.firstChild.textContent='Setor de entrega';
 select.add(new Option('Selecione o setor e veja a entrega',''));for(const s of setores){const option=new Option(rotuloSetor(settings,s),s);option.disabled=areaDoSetor(settings,s)?.ativo===false;select.add(option)}if(current&&!setores.includes(current))select.add(new Option(current,current));select.value=current;old.replaceWith(select);
 city.value='Jaru';city.readOnly=true;num.inputMode='numeric';num.autocomplete='address-line2';num.placeholder='Digite o número da casa';
 cep.inputMode='numeric';cep.autocomplete='postal-code';cep.maxLength=9;cep.pattern='[0-9]{5}-?[0-9]{3}';cep.placeholder='00000-000';street.autocomplete='off';street.placeholder='Digite a rua ou avenida';
 const quote=document.createElement('div');quote.className='notice';quote.setAttribute('role','status');label.after(quote);
 function update(){const q=resumoEntrega(settings,select.value,subtotal);quote.textContent=q.error??`Entrega: ${dinheiro(q.taxa)} • Total estimado: ${dinheiro(q.total)} • ${q.prazo}`}
 const suggestions=document.createElement('div');suggestions.className='street-suggestions';street.after(suggestions);
 const status=document.createElement('p');status.className='muted';status.setAttribute('role','status');street.closest('label').after(status);
 let timer,revision=0,controller,cepRevision=0;
 const message='Se não encontrar, mantenha a rua digitada. O setor deve ser confirmado por você.';
 const apply=item=>{revision++;controller?.abort();street.value=item.logradouro;if(item.cep)cep.value=item.cep;suggestions.replaceChildren();status.textContent='Rua preenchida. Confira o setor e o número da casa.'};
 function show(items){suggestions.replaceChildren();for(const item of items.slice(0,10)){const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=`${item.logradouro}${item.bairro?' • '+item.bairro:''}${item.cep?' • '+item.cep:''}`;b.onclick=()=>apply(item);suggestions.append(b)}}
 select.onchange=()=>{revision++;controller?.abort();suggestions.replaceChildren();update();if(street.value.length>=3)search()};
 async function search(){const r=++revision;controller?.abort();const query=street.value.trim();if(query.length<3){suggestions.replaceChildren();status.textContent='Digite pelo menos 3 letras para buscar ruas de Jaru.';return}
  const local=(areaDoSetor(settings,select.value)?.ruas??[]).filter(x=>normalizar(x).includes(normalizar(query))).map(x=>({logradouro:x}));show(local);status.textContent='Buscando ruas de Jaru…';controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),8000);
  try{const res=await fetch(`https://viacep.com.br/ws/RO/Jaru/${encodeURIComponent(query)}/json/`,{signal:controller.signal});if(!res.ok)throw Error();const data=await res.json();if(r!==revision||!street.isConnected)return;const rows=Array.isArray(data)?data.filter(x=>x.uf==='RO'&&normalizar(x.localidade)==='jaru'&&x.logradouro):[];const seen=new Set(local.map(x=>x.logradouro));show([...local,...rows.filter(x=>!seen.has(x.logradouro))]);status.textContent=message}catch{if(r===revision&&street.isConnected)status.textContent='Busca indisponível. Você pode digitar o endereço manualmente.'}finally{clearTimeout(timeout)}
 }
 street.oninput=()=>{revision++;controller?.abort();clearTimeout(timer);suggestions.replaceChildren();timer=setTimeout(search,650)};
 cep.oninput=()=>{cepRevision++};
 const lookup=document.createElement('button');lookup.type='button';lookup.className='secondary';lookup.textContent='Buscar pelo CEP';cep.after(lookup);
 lookup.onclick=async()=>{const code=cep.value.replace(/\D/g,''),r=++cepRevision,oldStreet=street.value;if(code.length!==8){status.textContent='Digite um CEP com 8 números.';return}lookup.disabled=true;status.textContent='Consultando CEP…';try{const res=await fetch(`https://viacep.com.br/ws/${code}/json/`,{signal:AbortSignal.timeout(8000)});if(!res.ok)throw Error();const d=await res.json();if(r!==cepRevision||!cep.isConnected)return;if(d.erro){status.textContent='CEP não encontrado. Preencha o endereço manualmente.';return}if(d.uf!=='RO'||normalizar(d.localidade)!=='jaru'){status.textContent='O CEP informado não corresponde a Jaru/RO. Confira o endereço.';return}if(d.logradouro&&street.value===oldStreet)street.value=d.logradouro;cep.value=d.cep;status.textContent=d.logradouro?'Endereço encontrado. Escolha seu setor e confira o número.':'CEP encontrado, sem rua específica. Digite sua rua e selecione o setor.'}catch{if(r===cepRevision)status.textContent='Não foi possível buscar o CEP. Preencha manualmente.'}finally{lookup.disabled=false}};
 const privacy=document.createElement('p');privacy.className='muted';privacy.textContent='A busca consulta o ViaCEP usando apenas o CEP ou o nome da rua e a cidade. Nome, telefone e número da casa não são enviados a esse serviço.';form.append(privacy);update();status.textContent=message;
}
