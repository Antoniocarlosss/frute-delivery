// Miniatura compacta para catálogos pequenos. Originais não são armazenados.
export async function prepararFoto(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Escolha uma foto JPG, PNG ou WebP.');
 if(file.size>12*1024*1024)throw Error('Escolha uma foto de até 12 MB.');
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();img.src=url;await img.decode();
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>60000000)throw Error('Foto muito grande. Escolha uma versão menor.');
  // Preserva a proporção e a orientação aplicada pelo navegador.
  for(const edge of [640,480,320]){
   const ratio=Math.min(1,edge/Math.max(img.naturalWidth,img.naturalHeight));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
   const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
   for(const quality of [.82,.65,.45]){const data=canvas.toDataURL('image/jpeg',quality);if(data.length<=160000)return data}
  }
  throw Error('Não foi possível reduzir a foto. Escolha outra imagem.');
 }finally{URL.revokeObjectURL(url)}
}
