# GameShelf API

API REST para organizar uma coleção pessoal de jogos. O projeto usa FastAPI,
Pydantic e uma arquitetura em camadas: controllers tratam HTTP, services
concentram regras de negócio e repositories encapsulam a lista em memória.

## Requisitos

- Python 3.10 ou superior

## Instalação e execução

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

A API estará disponível em `http://127.0.0.1:8000`, a documentação Swagger em
`http://127.0.0.1:8000/docs` e o health check em `http://127.0.0.1:8000/health`.

## Testes

```bash
pytest
```

Cada teste reinicializa o repositório em memória por meio de uma fixture do
pytest, garantindo isolamento total entre os cenários.

## Exemplos

Criar um jogo:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/games/ \\
  -H "Content-Type: application/json" \\
  -d '{"titulo":"Hades","plataforma":"PC","genero":"Roguelike","status":"playing","horas_jogadas":12.5,"nota":9}'
```

Listar jogos em andamento:

```bash
curl "http://127.0.0.1:8000/api/v1/games/?status=playing&plataforma=PC"
```

Atualizar progresso:

```bash
curl -X PATCH http://127.0.0.1:8000/api/v1/games/1/progress \\
  -H "Content-Type: application/json" \\
  -d '{"horas_jogadas":20,"status":"completed","nota":10}'
```
