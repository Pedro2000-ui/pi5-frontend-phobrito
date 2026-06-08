# PI5 - Vite Frontend Starter

> Repositório com um scaffolding básico para construir o front-end do projeto do PI5: Aplicações de Inteligência Artificial, do prof. Guilherme Rey.

## Requisitos

- Node.js `v22` ou maior

## Dependências

- Vite
- React
- TypeScript
- React Router
- Tailwind

## Organização deste repositório

O projeto foi organizado de modo que vocês possam importar módulos utilizando aliases, para facilitar (e diminuir o uso de caminhos relativos), sendo:

| Pasta         |    Alias     | Descrição                                       |
| :------------ | :----------: | :---------------------------------------------- |
| `public`      |     `--`     | Contém assets e itens acessíveis via URL direta |
| `src/assets`  | `@assets/*`  | Assets de dados e outros para importação direta |
| `src/core`    |  `@core/*`   | Componentes, helpers, modelos e tipos globais   |
| `src/feature` | `@feature/*` | Módulos da aplicação, encapsulados em features  |
| `src/routes`  | `@routes/*`  | Páginas equivalente às rotas da sua app         |
| `src/styles`  | `@styles/*`  | Folhas de estilo                                |
| `src/ui`      |   `@ui/*`    | Componentes genéricos de interface              |

## Como executar

- Clone o projeto OU crie um novo projeto à partir deste usando `tiged`:
  ```
  npx tiged https://github.com/Yarquen/pi5-frontend-scaffolding [nome-do-projeto] --mode=git
  ```
- Instale as dependências com o seu package manager de preferência:
  ```sh
  npm install
  # OU
  pnpm install
  # OU
  yarn install
  # OU
  bun install
  ```
- Execute o projeto:
  ```sh
  npm run dev
  # OU
  pnpm run dev
  # OU
  yarn dev
  # OU
  bun dev
  ```
- O projeto será executado em [`https://localhost:5173`](https://localhost:5173)
- URL Produção: https://pi5-frontend-phobrito-napdwffnl-phobrito.vercel.app/
