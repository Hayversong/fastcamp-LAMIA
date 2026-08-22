# GameShelf API

API REST para organizar uma coleção pessoal de jogos, com CRUD, filtros,
acompanhamento de progresso e resumo estatístico. Os dados são persistidos em
PostgreSQL por meio do SQLAlchemy, e a evolução do banco é controlada pelo
Alembic.

## Tecnologias

- Python 3.11+
- FastAPI e Pydantic
- SQLAlchemy 2
- PostgreSQL 16
- Alembic
- Poetry
- Pytest e SQLite para testes isolados
- Ruff para lint e formatação
- Docker Compose para o banco local

## Arquitetura

O domínio de jogos segue uma arquitetura em camadas:

```text
Controller (HTTP)
    ↓
Service (regras de negócio)
    ↓
Repository (consultas e persistência)
    ↓
Model SQLAlchemy ↔ PostgreSQL
```

```text
api/games/
├── controllers/    # rotas e conversão de erros para HTTP
├── services/       # regras de negócio
├── repositories/   # acesso ao banco com Session
├── models/         # entidade JogoORM
└── schemas/        # contratos Pydantic de entrada e saída
core/              # configuração, engine e dependências compartilhadas
migrations/        # migrations do Alembic
tests/             # testes HTTP com SQLite isolado
```

## Requisitos

- Python 3.11 ou superior
- Poetry
- Docker Desktop com Docker Compose

## Configuração inicial

Instale as dependências:

```bash
poetry install
```

Opcionalmente, crie o arquivo `.env` a partir do exemplo. Sem ele, a aplicação
usa a mesma URL PostgreSQL como valor padrão.

```powershell
Copy-Item .env.example .env
```

No Linux ou macOS:

```bash
cp .env.example .env
```

A configuração padrão é:

```env
DATABASE_URL=postgresql://admin:admin123@localhost:5432/fastcamp
```

## Banco de dados e migrations

Suba o PostgreSQL:

```bash
docker compose up -d
docker compose ps
```

Aplique todas as migrations:

```bash
poetry run alembic upgrade head
```

Confira a revisão aplicada:

```bash
poetry run alembic current
```

Para criar uma migration depois de alterar os models:

```bash
poetry run alembic revision --autogenerate -m "descricao da alteracao"
```

Revise o arquivo gerado antes de executar novamente o `upgrade head`.

## Executando a API

Com o PostgreSQL em execução e as migrations aplicadas:

```bash
poetry run fastapi dev main.py
```

Serviços disponíveis:

- API: <http://127.0.0.1:8000>
- Swagger: <http://127.0.0.1:8000/docs>
- ReDoc: <http://127.0.0.1:8000/redoc>
- Health check: <http://127.0.0.1:8000/health>

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica a saúde da API |
| `POST` | `/api/v1/games/` | Cadastra um jogo |
| `GET` | `/api/v1/games/` | Lista jogos e aceita filtros |
| `GET` | `/api/v1/games/stats/summary` | Retorna o resumo da coleção |
| `GET` | `/api/v1/games/{jogo_id}` | Busca um jogo pelo ID |
| `PUT` | `/api/v1/games/{jogo_id}` | Substitui os dados de um jogo |
| `PATCH` | `/api/v1/games/{jogo_id}/progress` | Atualiza o progresso |
| `DELETE` | `/api/v1/games/{jogo_id}` | Remove um jogo |

A listagem aceita os parâmetros opcionais `status` e `plataforma`. Os status
válidos são `backlog`, `playing`, `completed` e `dropped`.

## Exemplos de uso

No Windows, use `curl.exe` para evitar o alias do PowerShell.

Criar um jogo:

```bash
curl.exe -X POST http://127.0.0.1:8000/api/v1/games/ -H "Content-Type: application/json" -d '{"titulo":"Hades","plataforma":"PC","genero":"Roguelike","status":"playing","horas_jogadas":12.5,"nota":9,"data_compra":"2026-01-15"}'
```

Listar jogos em andamento na plataforma PC:

```bash
curl.exe "http://127.0.0.1:8000/api/v1/games/?status=playing&plataforma=PC"
```

Atualizar o progresso do jogo de ID 1:

```bash
curl.exe -X PATCH http://127.0.0.1:8000/api/v1/games/1/progress -H "Content-Type: application/json" -d '{"horas_jogadas":20,"status":"completed","nota":10}'
```

## Testes

Os testes usam `sqlite:///./test.db`, recriam as tabelas para cada cenário e
não dependem do PostgreSQL ou do Docker.

```bash
poetry run pytest -s -x --cov=api -vv
```

Também é possível executar a tarefa completa, que roda o Ruff antes dos testes
e gera o relatório HTML de cobertura em `htmlcov/index.html`:

```bash
poetry run task test
```

## Qualidade de código

```bash
poetry run ruff check .
poetry run ruff format --check .
```

Para aplicar correções e formatação:

```bash
poetry run task format
```

## Encerrando o ambiente

Parar os containers sem removê-los:

```bash
docker compose stop
```

Remover os containers preservando os dados do volume:

```bash
docker compose down
```

Para remover também os dados do PostgreSQL, use `docker compose down -v`. Essa
operação apaga permanentemente o banco local.
