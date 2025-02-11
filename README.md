# xpcDeckTrucoFE-SPASimple - Jogo de Truco Paulista usando API

Projeto de portifólio de front-end desenvolvido usando Typescript.

Usa o conceito de Single Page Aplication (SPA) onde existe apenas uma página
HTML e a navegação e renderização de páginas é feito via Javascript no
navegador.

Atualmente apenas cria novos jogos pela API de jogos pré-autorizados.

![Demonstração](game-demo.gif 'Demonstração')

## Tecnologias

Typescript 5.7

NodeJs 22.2

## Arquitetura

Arquivo de rotas no index.ts:

`/static e /*`: Rotas utilizada pelo SPA.

`/api-truco/`: Rotas de consumo do back-end acessadas pelo SPA via fetch.

`/lnk/`: Módulo de geração de links com jogos pré-autorizados onde o link serve
de chave para autenticar o usuário.

Rotas no SPA /spa/static/js/index.js:

`/*`: Página inicial vazia.

`/jogos`: Lista de Jogos (não implementado).

`/jogos/gameId`: Jogo.

`/pre-autz/player1/player2`: Gerador de links para jogos pré-autorizados.

Utilizado cookies para controle de sessão.

## Back-end

Projeto `xpcDeckTrucoBE` com a API REST consumida pelo front.

## Executando

Deve ser definido no arquivo `.env`:

- BASE_URL_API: URL apontando para o método (HTTP ou HTTPS) host e porta do
  servidor de back-end.

O servidor escuta nas portas 7779 (https) e 7780 (http). O certificado deve ser
informado na pasta rec/sslcert/(selfsigned.key e selfsigned.crt).

## À Fazer

- Lista de jogos.
- Tela de autenticação.
- Criação de jogos.
