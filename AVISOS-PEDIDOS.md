# Avisos de andamento

1. Envie todos os arquivos extraídos ao GitHub, substituindo os anteriores.
2. Abra o site com Ctrl+Shift+R e entre em Pedidos no navegador do cliente.
3. Clique em Ativar notificações dos pedidos e permita no navegador.
4. Mantenha a loja aberta em uma aba e altere o andamento de um pedido no painel. O cliente recebe aviso dentro do site e, quando permitido e suportado, uma notificação do navegador. Clicar nela abre Meus pedidos.

Não precisa alterar regras nem ativar plano pago. A assinatura de acompanhamento utiliza leituras da cota do Firestore. Não é notificação push: fechar a aba, ficar sem rede ou o celular suspender o navegador impede avisos em tempo real. Ao reconectar, pode ser mostrado o último estado diferente conhecido; não há garantia de receber etapas intermediárias ocorridas enquanto estava desconectado. Se o navegador bloquear notificações, o aviso continua dentro da loja.

Somente os pedidos desse cliente são acompanhados. O aviso não inclui nome, telefone nem endereço. O histórico continua sujeito à identidade local do navegador. Não há envio automático pelo WhatsApp nem alteração no pagamento.

18 testes locais passaram. Não foi possível testar a exibição de notificações em seu aparelho; confirme a permissão e o comportamento depois da publicação. Referência: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
