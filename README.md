# Documentação

Overview: Aplicação de controle de finanças pessoal.

# RF

- [] O Usuario deve poder criar uma nova transação
- [] O Usuario deve poder obter um resumo da sua conta
- [] O Usuario deve poder listar todas suas transações feitas anteriormente.
- [] O Usuario deve poder visualisar uma transação unica

# RN

- [] A transação pode ser do tipo Crédito que somará ao valor total ou Débito que subtrairá.
- [] Deve ser possível identificarmos o usuario entre as requisições
- [] O Usuario só pode visualizar transações as quais ele criou

# RNF

- 

Comando necessário para rodar migrations usando Knex: npm run knex -- migrate:latest
-> Quando quero definir um tipo no typescript tenho que criar o arquivo `nomeArquivo.d.ts` => Ou seja dessa maneira eu deixo claro que será um arquivo de definição de tipo.