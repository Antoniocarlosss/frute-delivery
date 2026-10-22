export function normalizarTelefone(value){
 const text=String(value??'').trim();if(!/^[+\d\s().-]+$/.test(text))return '';
 let digits=text.replace(/\D/g,'');if((digits.length===12||digits.length===13)&&digits.startsWith('55'))digits=digits.slice(2);
 return /^[1-9]{2}\d{8,9}$/.test(digits)?digits:'';
}
