# PI5 Frontend (phobrito)

## O que é esse projeto

Frontend do projeto PI5 de IA (prof. Guilherme Rey, Senac). A aplicação é um cliente web para uma plataforma de jogos competitivos com agentes de IA — o jogador pode listar partidas, ver o resultado de uma partida finalizada e assistir uma partida ao vivo como espectador.

Stack: React + Vite, com Tailwind e React Router v6.

---

## Organização das pastas

Seguimos a estrutura do scaffolding do professor, com os aliases já configurados:

```
src/
  core/      — helpers e utilitários globais (ex: leitura do token)
  feature/   — lógica específica de cada parte do sistema
  routes/    — páginas vinculadas às rotas
  ui/        — componentes visuais sem lógica de negócio
  styles/    — variáveis de tema e estilos globais
```

A separação entre `ui/` e `feature/` foi a decisão estrutural mais importante. Componentes como o badge de status, a paginação e o tabuleiro ficaram em `ui/` justamente porque eles não sabem de onde os dados vêm — recebem props e renderizam. A lógica de buscar partidas, registrar espectador, conectar no WebSocket, tudo isso ficou em `feature/`. Isso tornou muito mais fácil depurar problemas, porque em geral o bug estava numa camada só.

---

## Token do jogador

O token é inserido pelo usuário em uma tela de configurações e salvo no `localStorage` com a chave `player_token`. Não tem nada mais sofisticado do que isso, e não precisava ter — a plataforma emite um token fixo por jogador, não tem refresh, não tem OAuth.

Para não ficar chamando `localStorage.getItem` espalhado pelo código, criamos um helper simples em `src/core/` que centraliza essa leitura. Se um dia precisar trocar o mecanismo de persistência, muda em um lugar só.

---

## Listagem de partidas

A listagem foi a primeira tela desenvolvida. A API retorna todas as partidas de uma vez, então a paginação foi feita no cliente mesmo — filtramos por slice e exibimos N itens por página.

Cada partida tem um badge de status (`waiting`, `running`, `finished`, `cancelled`) e botões de ação que aparecem ou somem dependendo do estado da partida e de quantos slots ainda estão disponíveis. Esse comportamento condicional ficou em `GameList`, que consulta o estado e decide o que renderizar.

Uma coisa que aprendemos rápido: não dá pra usar classes do Tailwind montadas por interpolação de string (tipo `text-${cor}-500`), porque o Tailwind não consegue incluir essas classes no build final. Por isso o mapeamento de cor por status ficou como um objeto explícito com todas as classes escritas por extenso.

---

## Detalhe de partida finalizada

A rota `/games/:id` busca os dados da partida e, se o status for `finished`, renderiza o placar e o estado final do tabuleiro. Para outros status, redireciona para a tela de espectador ou mostra uma mensagem.

O tabuleiro 5×5 é um componente separado (`Board`) que recebe o estado do jogo como prop e pinta cada célula com a cor do time. Ele não faz nenhuma requisição, não tem `useEffect`, não sabe que existe WebSocket. Isso foi proposital — como ele é puramente visual, dá pra jogar qualquer estado estático nele durante o desenvolvimento pra ver como fica, sem precisar de uma partida real rodando.

---

## Tela de espectador

Essa foi a parte mais trabalhosa. O fluxo tem três etapas em sequência:

1. Buscar os dados da partida pela rota pra ter o `game_id`.
2. Chamar o endpoint de registro de espectador com o token do `localStorage`, recebendo um `spectator_token`.
3. Só então abrir a conexão WebSocket usando esse token.

O problema que nos travou por um bom tempo foi que a conexão WebSocket estava sendo tentada antes do `game_id` estar disponível, então o token nunca resolvia. A correção foi garantir que as três etapas acontecem em sequência dentro do `useEffect` da página, e não dentro do hook de WebSocket.

O hook `useGameSocket` ficou simples de propósito: recebe a URL do socket já montada e expõe `{ gameState, connected, error }`. Quem monta a URL e decide quando chamar o hook é a página. Essa separação evitou que o hook virasse um componente que sabe demais sobre o contexto de registro de espectador.

---

## Rotas

| Rota                  | Página            | O que faz                        |
|-----------------------|-------------------|----------------------------------|
| `/`                   | GameListPage      | Lista paginada de partidas       |
| `/games/:id`          | GameDetailPage    | Detalhe de partida finalizada    |
| `/games/:id/spectate` | SpectatorPage     | Acompanhar partida ao vivo       |
| `/settings`           | SettingsPage      | Inserir o access token           |

Rotas que precisam do token verificam a presença dele antes de renderizar. Se não tiver, mandam o usuário pra `/settings`.

---

## Estilo

O tema foi chamado internamente de Dark Arcade: fundo escuro (`#0f0f1a`), roxo (`#7c3aed`) e ciano (`#06b6d4`) como cores de destaque, fonte `JetBrains Mono`. As cores ficaram em variáveis CSS globais e o Tailwind foi configurado pra consumir essas variáveis.

Não foi uma escolha puramente estética — usar variáveis CSS significa que mudar o tema inteiro é uma alteração em um arquivo só, sem precisar caçar classe por classe nos componentes.

## Acesso
Url de produção: https://pi5-frontend-phobrito-napdwffnl-phobrito.vercel.app/
