export const produtos = [
 {id:'ninho',nome:'Creme de Ninho',categoria:'Cremes Gourmet',descricao:'Frutas fresquinhas com um delicioso creme de Ninho.',precos:{400:2500,500:3000},imagem:'creme-ninho.png'},
 {id:'maracuja',nome:'Creme de Maracujá',categoria:'Cremes Gourmet',descricao:'O encontro das frutas com o sabor tropical do maracujá.',precos:{400:2200,500:2800},imagem:'creme-maracuja.png'},
 {id:'sem-creme',nome:'Sem Creme',categoria:'Cremes Gourmet',descricao:'Uma seleção de frutas para saborear do seu jeito.',precos:{400:2200,500:2800}},
 {id:'laranja',nome:'Com Suco de Laranja',categoria:'Com Suco de Laranja',descricao:'Frutas com o toque refrescante do suco de laranja.',precos:{400:2500,500:3000}},
 {id:'condensado',nome:'Leite Condensado e Ninho',categoria:'Leite Condensado e Ninho',descricao:'Uma combinação cremosa e cheia de sabor.',precos:{400:2800,500:3200}}
];
export const dinheiro = n => (n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
