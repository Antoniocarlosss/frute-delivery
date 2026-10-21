# Atualização — setores, endereço e exclusão

Envie todos os arquivos extraídos para a raiz do GitHub, substituindo os anteriores. Esta atualização usa as mesmas regras do pacote anterior de fotos. Não exige alterar o usuário nem a coleção admins.

## Produtos
No Espaço da loja, cada produto agora tem Editar e Excluir produto. A exclusão pede confirmação e remove o documento do banco. Para apenas ocultar um produto, desmarque Disponível no cardápio ao editar. Atualize a vitrine após salvar ou excluir.

## Taxas
Em Loja e entregas em Jaru, estão os Setores 1 a 8, Savana Park e Jardim Europa. Preencha a taxa, o mínimo e o prazo de cada um e clique em Salvar loja e taxas. Nenhuma taxa foi inventada: vazio significa não configurada; 0 significa grátis. Há opção de suspender um setor. A loja precisa estar aberta para mostrar a estimativa. O total soma produtos e entrega, mas pagamentos e pedidos reais continuam desabilitados até existir backend seguro.

## Endereço
O cliente seleciona o setor e vê o total estimado. CEP e rua continuam editáveis. O botão Buscar pelo CEP consulta ViaCEP; digitar 3 ou mais caracteres da rua busca sugestões de Jaru/RO após uma pausa. A busca remota encontra ruas da cidade, não garante a correspondência ao setor comercial. Ruas cadastradas no painel para o setor aparecem primeiro. O cliente confirma seu setor e pode manter a rua digitada quando não houver resultado. O número da casa usa teclado numérico em aparelhos compatíveis, aceitando também texto caso necessário.

A busca não fornece uma lista completa de ruas de cada setor ao selecionar o setor. Isso exige uma base local confiável, que pode ser preenchida no painel (uma rua por linha). Não foram inventados logradouros ou CEPs. Não há acesso à localização GPS.

A consulta externa envia apenas CEP ou rua e cidade ao ViaCEP. Não envia nome, telefone ou número da casa. Falhas e ausência de resultados permitem preenchimento manual. Referência: https://viacep.com.br/

## WhatsApp
O botão Falar com a loja abre o contato comercial configurado no painel. Não envia mensagem sozinho.

## Verificação
12 testes locais passaram, incluindo setores, entrega gratuita versus taxa não configurada e loja fechada. A sintaxe dos arquivos foi conferida. Login, exclusão e endereço devem ser conferidos no projeto publicado; não houve operação no banco real. Faça um produto de teste, exclua-o e teste o checkout antes de divulgar.
