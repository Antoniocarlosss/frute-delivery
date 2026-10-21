# Atualização de fotos

1. Envie todos os arquivos deste pacote para a raiz do GitHub, substituindo os existentes.
2. No Firebase → Firestore → Regras, substitua todo o código pelo conteúdo de firestore.rules deste pacote e publique. O limite do campo imagem foi ampliado para a foto compacta. As permissões administrativas continuam obrigatórias.
3. Abra admin.html e entre. Em Produtos → Editar, escolha Adicionar ou trocar foto, selecione a foto e confira a prévia. Clique em Salvar produto. Atualize o cardápio para ver.

Também é possível remover a foto, confirmando com Salvar produto. Se cancelar a edição, a alteração não é gravada. JPG, PNG e WebP até 12 MB são aceitos; formatos como HEIC precisam ser convertidos antes.

Para o catálogo pequeno atual, o navegador cria uma miniatura JPEG com até 640 pixels e aproximadamente 120 KB, armazenada no documento do produto no Firestore. O original não é enviado. A foto utiliza as cotas do Firestore; este recurso não exige ativar Storage. Para catálogos maiores, migrar as imagens para um serviço de arquivos/CDN. Não há promessa de uso ilimitado gratuito.

O link Administração foi removido do cardápio. O acesso da proprietária continua pelo endereço terminado em /admin.html e a página foi renomeada para Espaço da loja. A segurança continua nas regras e no usuário autorizado.

Testes locais e sintaxe JavaScript foram verificados. A seleção na galeria do celular e o salvamento no projeto Firebase real ainda precisam ser conferidos após publicar.

Referência de limites: https://firebase.google.com/docs/firestore/quotas
