# Documentação

Overview: Aplicação de controle de finanças pessoal.

# RF

- [] O Usuario deve poder criar uma nova transação
- [] O Usuario deve poder obter um resumo da sua conta
- [] O Usuario deve poder listar todas suas transações feitas anteriormente.
- [] O Usuario deve poder visualisar uma transação unica
- [] Cada usuario com suas transações

# RN

- [] A transação pode ser do tipo Crédito que somará ao valor total ou Débito que subtrairá.
- [] Deve ser possível identificarmos o usuario entre as requisições
- [] O Usuario só pode visualizar transações as quais ele criou

# RNF

-

Comando necessário para rodar migrations usando Knex: npm run knex -- migrate:latest
-> Quando quero definir um tipo no typescript tenho que criar o arquivo `nomeArquivo.d.ts` => Ou seja dessa maneira eu deixo claro que será um arquivo de definição de tipo.

-> Cookies: Fundamento essêncial na web, são maneiras de mantermos contextos entre requisições
No contexto da aplicação desenvolvida a seguir, vamos utilizar cookies no contexto de que, o mesmo usuario que está realizando uma transação é o usuario que esta listando as transações e tudo mais.
Será idêntificado pelo campo session_id
É uma forma paralela a maneira de salvar credênciais de um usuario para saber quem e oque ela esta fazenda na aplicação.
Fluxo: `Usuario cria sua primeira transação` -> `anotamos um session_id` -> `quando esse usuario for listar suas transações` -> `validamos trasações apenas daquele session id`
Resume: Cookies são uteis para identificação de ususarios e anotar informações de contexto que precisamos saber entre requisições

### Boas práticas

- Validando existência de cookies nas demais rotas, para buscar transações apenas daquela sessão específica.
  Recomendado o uso de _middlewares_ para a validação de sessão.
- Criamos esses middlewares e usamos eles no fastify chamando pre-handlers na rota. Ou seja, a função que realiza a ação da rota é chamada de handler, e o pre-handler seria algo que ocorreria antes de ocorrer essa execução.