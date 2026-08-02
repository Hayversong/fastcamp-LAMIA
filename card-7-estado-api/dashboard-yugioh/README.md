# Yu-Gi-Oh! Regulation Dashboard

Dashboard responsivo para consultar as listas atuais de cartas proibidas, limitadas e semilimitadas do Master Duel, TCG e OCG.

## Stack

- Next.js App Router, React e TypeScript strict;
- Tailwind CSS e componentes shadcn/ui;
- Axios para o cliente HTTP;
- TanStack Query para cache e estado de servidor;
- Zustand para o usuário global mockado;
- Zod para validar respostas externas e internas;
- Vitest, jsdom e Testing Library para testes.

## Como executar

```bash
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
```

## Arquitetura

```text
app/
  api/regulations/route.ts  # proxy, cache e normalização da API externa
  layout.tsx                # providers e estrutura global
  page.tsx                  # página fina
components/
  ui/                       # componentes shadcn/ui
features/
  auth/                     # store Zustand do usuário
  regulations/
    components/             # composição visual do domínio
    hooks/                  # query, filtros, paginação e orquestração
    services/               # chamada Axios à API interna
    schemas.ts              # schemas Zod
    types.ts                # tipos inferidos
lib/                        # helpers compartilhados
services/                   # cliente Axios
tests/                      # schemas, hooks e formatadores
types/                      # reexports públicos
```

## Fluxo de dados

```text
UI → hook TanStack Query → service Axios → /api/regulations
   → API pública → validação Zod → resposta normalizada → cache → UI
```

A aplicação não expõe secrets. A URL pública externa permanece no route handler do servidor, que valida a modalidade, trata falhas externas e normaliza a resposta antes de entregá-la ao cliente.

## Decisões de escopo

- Não há formulário, portanto React Hook Form não foi adicionado.
- A busca é exata por ID, então Fuse.js não agregaria valor.
- React Query atende ao compartilhamento atual dos dados; um Context adicional duplicaria estado.
- As cartas não possuem imagens nessa API, portanto `next/image` e placeholder não são necessários.

## Fonte de dados

[YAML Yugi Limit Regulation](https://github.com/DawnbrandBots/yaml-yugi-limit-regulation)

## Variáveis de ambiente

Copie `.env.example` para `.env.local` quando precisar alterar as URLs padrão.
A URL externa fica disponível apenas no Route Handler; o navegador consome a
rota interna configurada em `NEXT_PUBLIC_API_BASE_URL`.

O cliente Axios também possui um interceptor de request que adiciona
`Authorization: Bearer <token>` quando existe uma chave `token` no
`localStorage`. A API pública não exige autenticação, mas o interceptor demonstra
o padrão solicitado pelo card.
