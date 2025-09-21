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

### Como trabalhar com a criação de Handlers Globais

Podemos criar middlewares globais que vão ser usados em todas as rotas da nossa aplicação.
Como o fastify trabalha com plugins, dentro de cada plugin, ou seja, de cara arquivo que contenha suas rotas, podemos ter um contexto, ou seja, valores que só funcionam dentro daquele handler que fica em volta das rotas.

_Criação de Handler Global_: Que irá agir independente da rota na qual o usuario está acessando.
Dentro do fastify, temos recursos denominados de hooks, esses hooks servem para ouvirmos eventos específicos dentro da aplicação baseando se nas ações de _request_ e _response_
Dica: Se eu usar o hook apenas nas rotas de um plugin ele funcionará apenas dentro do contexto daquele plugin, para que funcione independente de rota, e funcione no projeto todo, basta declarar no arquivo que chama todos os plugins _server.ts_ e aplicar antes da declaração deplugins o hook.

### Entendendo Testes Automatizados

- _Aula essêncial_
  Conceito: São formas de mantermos confiança na hora de dar manutenção no código ao longo do prazo.
  Testes são fundamentais para cobrir falhas de desenvolvimento.
  Garantem que a alteração de pequenas partes do código, executar testes automatizados que por muitas vezes tentam simular ações dos usuarios no sistema.
  Tipos de testes.
  Assegurar que as funcionalidades estejam funcionando corretamente!.
  _Tipos de Testes_
- Unitarios => Testam exclusivamente testam uma unidade da aplicação, ou seja uma pequena parte de forma isolada. ex: uma função.
  Função de formatar data, consigo executar ela e ver se ela me deu o retorno que eu estava esperando.
- Integração => Quando testo a comunicação entre duas ou mais unidades, varios pedações melhores funcionam quando estão trabalhando juntas.
- E2E - Ponta a Ponta: São testes que basicamente simulam um usuario operando na nossa aplicação.
- Pirâmide de Testes: Cada teste possui uma dificuldade e uma exigência para que o teste possa ser realizado.
  _Primeiro teste que uma pessoa que nunca realizou um teste deveria fazer é:_ Testes E2E: Não dependem de tecnologia, nao dependem de arquitetura de software, não dependem de nada.
  Os outros demais testes são mais recomendados utilizar por conta da performance, o teste E2E por si só, ele é querendo ou não mais devagar.

### Criando primeiro Teste E2E

- Geralmente usamos: Jest ou Vitest
- O teste é composto geralmente por três variaveis importantes[
  "enunciado", operação, e a validação
  ]

Exemplo:

<code>import { test, expect } from "vitest";
test("o usuario consegue listar uma nova transação", () => {
// fazer a chamada http para criar uma nova transação.

const responseStatusCode = 201
//validação
expect(responseStatusCode).toEqual(201);
});
</code>

No exemplo acima, teoricamente ele estaria simulando uma requisição do cliente retornando uma resposta de 201 e a validação logo abaixo estaria esperando declarado pelo método _expect_ que essa resposta fosse equivalente a _201_

### Testando a criação da minha transação

- Para realizar ações ao servidor, é necessário utilizar de uma ferramenta chamada _supertest_ para que não precisemos criar o servidor novament dentro do teste.
- A dica dessa aula é modularizar o app.ts do server.ts, aonde no arquivo server.ts deixamos tudo a partir do app.listen e modularizamos toda a instanciação do app para um arquivo externo e o importamos no servidor.
  O resultado disso => Quando formos realizar o teste, podemos chamar a instancia de app sem que seja necessário chamar o listen do servidor.
- Com isso, possibilito que eu tenha acessoa a minha aplicação sem precisar subir um servidor para ela.
- Antes de realizar um teste, eu preciso assegurar que minha aplciação terminou de carregar todos os seus plugins.

### Categorizando Testes da Aplicação

- Posso criar categorias dentro da minha aplicação usando o método _describe_ do vitest que me permite agrupar e deixar meu log mais limpo de testes e mais infomartivo.
- Outro detalhe importante, pode ser encontrado no lucar do _teste_ a declaração usando _it_ na hora de declarar um teste, o resultado final é o mesmo.

### Testando Listagem de transações

**REGRA**

- Todo teste deve se excluir de qualquer contexto, ou seja
  eu jamais posso escrever um teste que dependa de outro teste, se um teste depende de outro, eles deveriam ser o mesmo teste.
- Ou seja, sempre que formos criar um teste, temos que sair do principio que outros testes não existem!.

### Configurando Banco de Testes

- Basicamente um banco de dados para testes, pois quando rodamos os testes eles realizam uma ação no banco.
- O ideal seria que fosse em um ambiente limpo.

### Finalizando os testes da aplicação.

- O teste deve se adaptar ao código ao invés do contrário.

### Preparando para o deploy
- Configurar o projeto e coloca-lo no ar
( Nenhuma plataforma que hospeda node na nuvem suporta typescript, ou seja é necessário buildarmos para javascrip nativamente.)
- Builando pela maneira nativa utilizando o `npx tsc` ele demora consideravelmente para buildar, ainda mais para projetos maiores.
- Na aula é recomendado a utilização de `tsup` para instala-lo basta usar `npm install tsup -D`
- Após isso, vou no meu arquivo  `package.json` e adiciono o script de build pra rodar: `"build": "tscup src -d build",`
