# Mini-chat em tempo real com FastAPI

Exercício completo de comunicação bidirecional usando WebSockets nativos do
FastAPI/Starlette e a API `WebSocket` do navegador, sem Socket.IO.

## Estrutura

```text
codigo_pessoal/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── pages.py
│   │   └── websocket.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── message.py
│   └── services/
│       ├── __init__.py
│       └── connection_manager.py
├── static/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── tests/
│   └── test_chat.py
├── .gitignore
├── README.md
├── requirements-dev.txt
└── requirements.txt
```

## Como executar

Requer Python 3.12 ou superior. No PowerShell, a partir desta pasta:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

Abra <http://127.0.0.1:8000> em duas abas. Em cada aba, digite um nome e clique
em **Entrar no chat**; a conexão WebSocket só será aberta após essa identificação.
Envie uma mensagem em uma delas e observe o broadcast imediato nas duas.

Para instalar as dependências de desenvolvimento e executar os testes:

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

Foi escolhido `requirements.txt` porque o projeto é pequeno, didático e assim
funciona com o `pip` que já acompanha o Python. Em um projeto maior, `uv` com
`pyproject.toml` e lockfile seria uma ótima evolução para instalações mais rápidas
e totalmente reproduzíveis.

## Configuração

As opções abaixo podem ser definidas como variáveis de ambiente antes de iniciar:

| Variável | Padrão | Função |
|---|---:|---|
| `CHAT_HOST` | `127.0.0.1` | Host documentado para execução |
| `CHAT_PORT` | `8000` | Porta documentada para execução |
| `CHAT_ECHO_MESSAGES` | `true` | Inclui o remetente no broadcast |
| `CHAT_ANNOUNCE_CONNECTIONS` | `true` | Avisa entradas e saídas |

Exemplo para não ecoar mensagens ao remetente:

```powershell
$env:CHAT_ECHO_MESSAGES = "false"
uvicorn app.main:app --reload
```

## Frontend separado ou servido pelo FastAPI?

Neste projeto o próprio FastAPI entrega `index.html`, CSS e JavaScript. Essa é a
opção recomendada para o exercício: há um único comando, uma única origem e não é
preciso configurar CORS. O frontend também pode ser servido separadamente (por
exemplo, com `python -m http.server`): nesse caso, altere a URL construída em
`script.js` para apontar para `ws://127.0.0.1:8000/ws`. CORS protege requisições
HTTP e não WebSockets; para uma implantação separada, valide o cabeçalho `Origin`
no endpoint WebSocket e configure CORS caso adicione chamadas HTTP à API.

## Evolução para streaming de uma LLM

No projeto final, o endpoint recebe o prompt e inicia um iterador assíncrono do
provedor da LLM. Cada token ou trecho retornado vira uma mensagem com tipos como
`stream_start`, `stream_chunk` e `stream_end`, enviada por
`ConnectionManager.send_personal_message()` ao `client_id` que fez a pergunta.
O frontend concatena os chunks na mesma bolha. Como conexões e entrega já estão
isoladas do handler, o serviço da LLM não precisa conhecer detalhes do WebSocket;
também fica natural adicionar cancelamento, autenticação, salas e persistência.

> Observação: este gerenciador mantém conexões em memória e funciona em um único
> processo. Para múltiplos workers/servidores, use um broker (como Redis Pub/Sub)
> para distribuir os eventos entre processos.
