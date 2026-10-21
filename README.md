# Pacote sem subpastas

Extraia o ZIP e envie TODOS os arquivos diretamente à raiz do repositório. Preserve os nomes originais dos arquivos; a tradução visual do navegador não deve ser usada para renomeá-los.

# FRUTÊ Delivery — primeira versão funcional

Projeto em HTML, CSS e JavaScript sem etapa de build. As imagens fornecidas foram incluídas com seus textos originais. As demais fotos usam placeholders.

## Publicar pelo GitHub

1. Extraia o ZIP no computador.
2. No GitHub, crie um repositório chamado `frute-delivery`.
3. Use **Add file → Upload files** e envie **o conteúdo da pasta frute-delivery**. O `index.html` deve ficar na raiz do repositório, junto dos demais arquivos, todos sem subpastas. Não envie apenas o ZIP.
4. Confirme o envio com **Commit changes**.
5. Em **Settings → Pages**, escolha publicação por branch, branch `main` e pasta `/ (root)`. Salve.
6. Aguarde o endereço aparecer nessa tela. Abra por HTTPS.

Os caminhos são relativos e funcionam em subpastas do GitHub Pages. Não abra o index com duplo clique: módulos JavaScript precisam de servidor HTTP. Para testar localmente com Node instalado, execute `npx --yes serve .` na pasta e abra o endereço informado.

## O que funciona agora

- Cardápio oficial com busca, categorias, detalhes, tamanhos, quantidade e observações.
- Carrinho persistente com alteração de quantidades, remoção e subtotal em centavos.
- Perfil e endereço locais com opção de salvar e de apagar. Aniversário e consentimento promocional opcionais.
- Revisão do pedido e rascunhos locais, identificados como não enviados. Nenhum dado pessoal é enviado pelo app nesta etapa.
- Link para atendimento comercial no WhatsApp, aberto somente ao clicar.
- Layout responsivo, manifest, ícone SVG e cache dos arquivos estáticos após o primeiro acesso online. A disponibilidade de instalação depende do navegador; ícones PNG dedicados e verificação em aparelhos reais ainda são necessários.
- Tela administrativa com login Firebase, verificação de custom claim admin e cadastro inicial/edição de preços no Firestore, **após configuração externa**.

## Limitações explícitas

Esta versão não recebe pedidos reais, não calcula taxa de entrega, não cobra Pix, não mostra faturamento, não envia promoções e não acompanha entregas. O botão Pix fica desativado. Rascunhos não são vendas. O painel não inclui ainda upload, categorias editáveis, relatórios ou gestão de pedidos.

A vitrine usa `produtos.js`; a edição de preços no painel grava apenas no banco e **ainda não atualiza a vitrine**. A integração do catálogo público e o backend são a próxima etapa, documentada em `BACKEND-PENDENTE.md`. Não anuncie esta versão como loja pronta para vender.

## Configurar Firebase

1. Crie um projeto Firebase e registre um aplicativo Web. Copie a configuração pública para `firebase-config.js`. Essa configuração identifica o projeto e não substitui autorização.
2. Ative Authentication por e-mail e senha. Crie a conta administrativa no console. Autorize o domínio do site nas configurações de Authentication.
3. Em um ambiente confiável com Firebase Admin SDK, conceda `admin: true` como custom claim à conta escolhida. Não implemente concessão de permissão no navegador e não coloque credenciais do Admin SDK no repositório. Entre novamente após conceder a claim.
4. Crie o Firestore e publique `firestore.rules`. Publique `storage.rules` se habilitar Storage. Com Firebase CLI autenticado e projeto selecionado: `firebase deploy --only firestore:rules,storage` (exige serviços previamente criados).
5. Abra `admin.html` e entre. Cadastre os produtos iniciais pelo botão; ele preserva documentos existentes.

As regras negam o acesso por padrão. Produtos e configurações públicas podem ser lidos publicamente; nunca guarde informações pessoais nessas coleções. Pedidos são legíveis apenas por administradores ou pelo UID proprietário. Todas as gravações de pedidos estão bloqueadas no cliente até existir backend seguro. Não existem senhas padrão.

Referências oficiais: [Firebase Web](https://firebase.google.com/docs/web/setup), [Authentication](https://firebase.google.com/docs/auth/web/password-auth), [Custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [GitHub Pages](https://docs.github.com/en/pages).

## Arquivos

`index.html`: app do cliente; `app.js`: navegação, perfil, carrinho e rascunhos; `produtos.js`: catálogo inicial e formatação monetária; `admin.html` e `admin.js`: administração inicial; `firebase-config.js`: configuração pública; `firestore.rules` e `storage.rules`: permissões; `service-worker.js` e `manifest.json`: base PWA.

## Verificação

Execute `node --test catalogo.test.mjs`. Os testes verificam preços oficiais, subtotal do exemplo e integridade dos recursos locais. Login Firebase, regras em emulador, instalação em celular e Pix exigem configuração e validação próprias; não foram testados com credenciais reais.

Para validar manualmente: adicione 2 Ninho 400 ml e 1 Maracujá 500 ml (subtotal R$ 78,00); recarregue a página; altere quantidades; salve/apague o perfil; revise o endereço; salve um rascunho; confira que nenhum pagamento foi aprovado. Após alterar o cache estático, atualize a versão em service-worker.js.
