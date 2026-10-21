export const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeImage(value){
 if(!value)return '';
 if(/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/i.test(value))return value;
 try{const url=new URL(value);return url.protocol==='https:'?url.href:''}catch{return ''}
}
export function validProduct(p){return p&&/^[a-zA-Z0-9_-]{1,80}$/.test(p.id)&&typeof p.nome==='string'&&p.nome.trim().length>0&&p.nome.length<=100&&typeof p.descricao==='string'&&p.descricao.length<=1000&&typeof p.categoria==='string'&&p.categoria.length>0&&p.categoria.length<=100&&['400','500'].every(s=>Number.isSafeInteger(p.precos?.[s])&&p.precos[s]>0&&p.precos[s]<=1000000)&&typeof p.ativo==='boolean'&&(!p.imagem||Boolean(safeImage(p.imagem)))}
export function cleanCart(cart,products){return Array.isArray(cart)?cart.filter(x=>x&&products.some(p=>p.id===x.id&&p.ativo!==false&&p.precos[x.size])&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=99).map(x=>({...x,note:String(x.note??'').slice(0,300)})):[]}
export function deliveryQuote(settings,profile,subtotal){
 if(!settings||settings.aberta!==true)return {error:'A loja está fechada ou ainda não foi configurada.'};
 const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
 const area=settings.areas?.find(a=>norm(a.bairro)===norm(profile.bairro)&&norm(a.cidade)===norm(profile.cidade));
 if(!area)return {error:'Este bairro/cidade não está na lista de entrega. Consulte a loja.'};
 if(!Number.isSafeInteger(area.taxa)||area.taxa<0||!Number.isSafeInteger(area.minimo)||area.minimo<0)return {error:'Configuração de entrega inválida. Consulte a loja.'};
 if(subtotal<area.minimo)return {error:`Pedido mínimo para este bairro: ${(area.minimo/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}.`};
 return {taxa:area.taxa,total:subtotal+area.taxa,prazo:String(area.prazo??'A combinar')};
}
