# Backend de produção — etapa futura

Nenhuma função financeira foi implementada nesta primeira versão. Esta pasta documenta a arquitetura prevista; não contém endpoints publicáveis.

Antes de habilitar vendas:

1. Identificar clientes por Firebase Anonymous Authentication, sem exigir senha. Vincular cada pedido ao UID autenticado. Recuperação em outro aparelho exige verificação adicional.
2. Criar uma função autenticada createOrder. Receber apenas IDs, tamanhos, quantidades, observações e endereço. Buscar preços, disponibilidade, horários, pedido mínimo e taxas no Firestore; recalcular tudo em centavos no servidor. Validar limites de entrada e implementar proteção contra abuso.
3. Exigir chave de idempotência por tentativa de checkout. Gravar pedido e chave de forma atômica; repetição deve retornar o mesmo pedido.
4. Integrar a API oficial do Mercado Pago em ambiente de testes. Guardar access token e segredo de webhook somente no Secret Manager. O navegador nunca recebe esses segredos.
5. Validar a assinatura do webhook conforme a documentação vigente do provedor, consultar o pagamento na API e conferir conta recebedora, referência, moeda e valor antes de confirmar. Deduplicar eventos e aplicar transições de status em transações.
6. Impedir que operações de preparação e entrega alterem o estado financeiro. Registrar auditoria. Considerar cancelamentos e reembolsos nos relatórios.
7. Adicionar upload administrativo de imagens, áreas de entrega, configurações da loja, gestão de pedidos em tempo real e catálogo público do Firestore.
8. Testar regras no Emulator Suite, autorização, duplicidade de checkout/webhook, pagamento divergente e indisponibilidade de rede antes de liberar.

Nunca aceitar uma confirmação de pagamento enviada pelo navegador. Nunca habilitar gravação pública em orders para contornar a ausência das funções.
