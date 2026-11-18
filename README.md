# Fastcamp LAMIA

Atividades práticas do **Fastcamp de desenvolvimento web do LAMIA**. Cada pasta `card-*` é uma etapa do curso: `codigo_aula` traz o que foi feito em aula e `codigo_pessoal` (ou `codigo_atividade_pratica`) traz a minha entrega, com README próprio explicando como rodar.

## Destaques de frontend

| Projeto | O que é | Stack |
|---|---|---|
| [**Yu-Gi-Oh! Regulation Dashboard**](card-7-estado-api/dashboard-yugioh) | Consulta as listas de cartas proibidas, limitadas e semilimitadas do Master Duel, TCG e OCG | Next.js, TypeScript, TanStack Query, Zustand, Zod, shadcn/ui |
| [**Lamia Analytics Dashboard**](card-5/codigo_pessoal) | Dashboard responsivo com gráficos | Next.js, TypeScript, Tailwind CSS, Recharts |
| [**Games Review**](card-4/codigo_atividade_pratica) | Registro e avaliação de jogos, com capas buscadas na API RAWG | Next.js, React, Tailwind CSS |

## Todos os cards

| Card | Tema | Entrega | Stack |
|---|---|---|---|
| [3](card-3) | Fundamentos de TypeScript | Classes, funções, objetos e generics | TypeScript |
| [4](card-4) | Frontend com React | Games Review e exercício de aula | React, Vite, Next.js, Tailwind CSS |
| [5](card-5/codigo_pessoal) | Dashboard com Next.js | Lamia Analytics Dashboard | Next.js, shadcn/ui, Recharts |
| [7](card-7-estado-api/dashboard-yugioh) | Estado e consumo de API | Yu-Gi-Oh! Regulation Dashboard | TanStack Query, Zustand, Zod, Axios |
| [8](card-8/codigo_pessoal) | APIs REST | GameShelf API, em camadas e em memória | Python, FastAPI, Pydantic |
| [9](card-9/codigo_pessoal) | Banco de dados e autenticação | GameShelf API com PostgreSQL, migrations e auth | FastAPI, SQLAlchemy, Alembic, PostgreSQL |
| [10](card-10/codigo_pessoal) | Tempo real | Mini-chat com WebSockets nativos | FastAPI, WebSocket API |
| [11](card-11) | IA aplicada | Assistente de pesquisa com RAG e streaming SSE | FastAPI, Ollama, Docker |

## Como rodar

Clone o repositório e entre na pasta do card que quer executar:

```bash
git clone https://github.com/Hayversong/fastcamp-LAMIA.git
cd fastcamp-LAMIA/card-7-estado-api/dashboard-yugioh
```

Os projetos de frontend usam Node.js (`npm install` e `npm run dev`). Os de backend usam Python (Poetry ou `pip install -r requirements.txt`). As instruções completas estão no README de cada card.
