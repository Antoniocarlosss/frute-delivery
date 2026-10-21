# FRUTÊ Delivery — catálogo e administração Firebase

Todos os arquivos deste pacote ficam na raiz, sem subpastas.

## Publicação
Extraia o ZIP e envie todos os arquivos ao repositório do GitHub, substituindo os anteriores. Preserve os nomes. Em Settings → Pages, use a branch principal e / (root).

## Configuração
Siga CONFIGURAR-FIREBASE.md. A configuração pública em firebase-config.js ainda precisa ser preenchida com a do seu projeto.

## Disponível após configurar
Login administrativo por e-mail/senha, autorização em admins/UID com enabled=true, cadastro e edição de produtos, preços em reais, descrição, categoria, foto por link HTTPS ou nome de arquivo, disponibilidade, loja aberta/fechada e áreas de entrega por cidade/bairro. O cardápio carrega os dados do Firestore ao abrir ou atualizar a página. O cliente mantém carrinho e perfil no aparelho.

## Ainda não disponível
Envio de pedidos reais, Pix, relatórios, histórico de vendas, upload pelo painel, cupons e notificações. A entrega mostrada é estimativa local; os valores finais precisam ser validados pelo servidor antes de habilitar vendas. Nenhum rascunho é um pedido enviado.

## Segurança
Publique as regras deste pacote antes de liberar o painel. A coleção admins só pode ser alterada pelo console ou por servidor confiável. Produtos e configurações são públicos e não devem conter dados pessoais. A gravação de pedidos pelo cliente continua bloqueada. Não publique senha nem credenciais de conta de serviço.

## Verificação
node --test catalogo.test.mjs firebase.test.mjs

Oito testes locais passaram. Login, permissões no projeto real e regras no emulador ainda precisam de validação com o Firebase configurado. Atualize o cardápio após alterar produtos no painel. Consulte BACKEND-PENDENTE.md para as próximas etapas do backend.

Referências: https://firebase.google.com/docs/web/setup e https://firebase.google.com/docs/rules/basics
