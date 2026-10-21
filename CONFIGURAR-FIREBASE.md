# Ativar o painel e o catálogo

Esta atualização mantém todos os arquivos sem subpastas. Substitua os arquivos da raiz pelos deste pacote. O Pix e o envio de pedidos continuam desabilitados.

1. Firebase → Configurações do projeto → Geral → Seus aplicativos → Web. Registre um aplicativo se necessário. Copie o objeto de configuração pública para `firebase-config.js`. Não use credenciais de conta de serviço.
2. Authentication → Sign-in method: habilite E-mail/senha. Em Users, adicione um usuário com seu e-mail e uma senha escolhida por você. Sua conta Google usada para abrir o console não se torna automaticamente um usuário do aplicativo.
3. Authentication → Settings → Authorized domains: adicione `antoniocarlosss.github.io` (confira o nome exato da sua conta GitHub). Não inclua protocolo nem caminho.
4. Crie o Cloud Firestore. No editor de regras, cole o conteúdo completo de `firestore.rules` deste pacote e publique.
5. Authentication → Users: copie o UID do usuário criado. No Firestore → Data, crie a coleção `admins`, documento com ID **exatamente igual ao UID**. Adicione o campo `enabled` do tipo boolean com valor `true`. Não use o e-mail como ID. Essa autorização só pode ser criada no console ou por um servidor confiável; o aplicativo não permite promover usuários.
6. Envie os arquivos atualizados ao GitHub. Abra `admin.html` no endereço do site e entre com o usuário criado no Authentication.
7. Clique em cadastrar os cinco produtos iniciais. Edite nomes, categorias, descrições, preços, fotos e disponibilidade. Salve as configurações de loja e as áreas de entrega. Não existe taxa padrão: as linhas de exemplo são apenas instrução.
8. Atualize a página do cliente. O catálogo e os preços agora vêm do Firestore. Produtos indisponíveis saem da vitrine e do carrinho quando a página é recarregada. Falhas de conexão impedem carregar preços antigos como se fossem atuais.

Fotos: envie o arquivo ao GitHub e informe seu nome exato no painel (ex.: `creme-ninho.png`), ou use um link HTTPS direto para imagem. Upload pelo painel ainda não está implementado.

As áreas são estimadas no navegador por cidade e bairro. A criação de pedidos e os cálculos finais devem ser validados pelo backend antes de habilitar vendas e Pix. Este pacote não habilita pagamentos.

O cadastro de administrador foi alterado nesta versão: usa documento `admins/UID` protegido pelas regras, em vez da custom claim da primeira versão. As regras de Storage seguem essa mesma autorização, mas o Storage ainda não é usado pelo painel.

Validação local: `node --test catalogo.test.mjs firebase.test.mjs`. A configuração real, as regras no Emulator Suite e o login devem ser testados no seu projeto antes do uso operacional.

Referências: https://firebase.google.com/docs/web/setup e https://firebase.google.com/docs/rules/basics
