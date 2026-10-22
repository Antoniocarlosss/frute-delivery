# Pedidos no plano gratuito

## Ativação

1. Envie todos os arquivos deste pacote, extraídos, para a raiz do repositório GitHub, substituindo os anteriores.
2. Firebase → Authentication → Sign-in method → Adicionar provedor → Anônimo → Ativar e salvar. Isso identifica automaticamente o navegador do cliente sem pedir login, e não concede acesso administrativo. O administrador continua entrando somente com e-mail e senha.
3. Firebase → Firestore → Regras: substitua todo o conteúdo por firestore.rules DESTE pacote e publique. As regras antigas bloqueiam o envio de pedidos.
4. No painel, configure as taxas dos setores, marque Loja aberta e salve. Verifique disponibilidade e preços dos produtos.
5. Aguarde a publicação do GitHub e abra a loja com Ctrl+Shift+R.
6. Faça um pedido identificado como teste nas observações. Confira no painel o nome, endereço, produtos, entrega e total. Atualize para Em preparação, Saiu para entrega e Entregue. No navegador do cliente, veja a atualização em Meus pedidos. Você também pode cancelar um pedido antes de ser entregue; pedidos cancelados e entregues não podem voltar para etapas anteriores.

## Funcionalidades

- Cliente envia um pedido real para o banco e recebe um identificador. O carrinho só é limpo após confirmação da gravação.
- As regras no servidor conferem os produtos atuais, disponibilidade, tamanhos, quantidades, setor, taxa, subtotal e total. Se preços mudarem, o cliente precisa revisar a página.
- Gravação atômica do pedido e de suas linhas de validação. São aceitas até 8 linhas por pedido, com até 99 unidades por linha. Linhas com observações diferentes contam separadamente.
- Repetir uma tentativa com o mesmo conteúdo e navegador reutiliza o mesmo ID para reduzir duplicação se a resposta de rede se perder. Isso não impede que alguém inicie deliberadamente outro pedido.
- Pedidos aparecem no painel em tempo real, com aviso visual de novos pedidos enquanto a página está aberta. Não há notificação push nem envio automático pelo WhatsApp.
- O administrador só pode mudar o andamento. Não pode alterar valores nem marcar pagamento nesta etapa.
- Cada cliente lê somente os pedidos vinculados à identidade automática de seu navegador. Trocar de aparelho ou apagar os dados do navegador pode perder esse acesso. Não há recuperação por telefone.
- Até 100 pedidos são exibidos por consulta. O painel mostra os 100 mais recentes. Paginação e arquivamento ficam para uma etapa posterior.

## Pagamento e cotas

O pedido registra payment=nao_cobrado. Não existe cobrança Pix nem confirmação financeira. Combine a forma de pagamento com a loja; não considere um pedido recebido como venda paga. Não há relatórios de faturamento confirmado nesta etapa.

Não foram usados Cloud Functions nem ativada cobrança. As operações usam as cotas do plano Spark. Caso os limites sejam atingidos, o serviço pode parar de aceitar operações até a reposição das cotas. A identidade anônima não confirma que o telefone pertence ao cliente e não elimina pedidos falsos; confira os pedidos recebidos. Não há proteção avançada contra abuso por criação de muitas identidades.

Os dados de nome, telefone e endereço são enviados à loja ao confirmar. Data de aniversário e consentimento promocional não são gravados no pedido. O navegador guarda o perfil somente conforme a opção escolhida pelo cliente. Defina sua rotina de retenção dos pedidos no console conforme a necessidade do negócio.

## Testes executados

13 testes locais de catálogo, sanitização e taxas; 16 testes de regras no Firestore Emulator, sem tocar no projeto real. Incluíram: pedido válido; leitura própria; bloqueio de outro cliente e acesso público; consulta própria; preço e entrega adulterados; pagamento inventado; mudança de status pelo cliente; sobrescrita do pedido; atualização pelo administrador; alteração de pagamento pelo administrador; transição inválida; 8 linhas aceitas; 9 linhas rejeitadas; loja fechada. A interface e o Firebase do seu projeto precisam da conferência manual descrita acima.

Os testes de regras estão em regras-pedidos.test.mjs. Para reproduzir com Node e Java 21: instale as dependências de desenvolvimento e execute `npm run test:rules`. Esse comando usa o projeto de demonstração demo-frute e não o projeto real.

Referências oficiais:
https://firebase.google.com/docs/auth/web/anonymous-auth
https://firebase.google.com/docs/firestore/security/rules-conditions
https://firebase.google.com/docs/firestore/quotas
