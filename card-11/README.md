# Assistente de Pesquisa Científica com FastAPI e RAG

Entrega didática do card: **segurança de API keys, tokens, streaming e RAG**.
Base: [Felipe Lapa — branch v2-api](https://github.com/felipelapadn/Assistente-Pesquisa-Cientifica/tree/v2-api),
commit `f01c85c1ed8ad8b689c0d9b18fa40d3151ce04ea`.
A estrutura de API, controlador, prompts e RAG foi mantida. A adaptação corrige a
chamada assíncrona sem `await`, implementa streaming de fato e documenta o consumo.

## Setup local

Use **Python 3.11 a 3.13**. Python 3.14 não é o alvo destas dependências.
No Windows/PowerShell, a partir da raiz:

```powershell
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

O projeto também possui `pyproject.toml`, seguindo o padrão dos cards anteriores.
Quem usa Poetry pode instalar a API e as ferramentas de desenvolvimento com:

```powershell
poetry install --with dev
poetry run task test
```

Para incluir o fluxo automático opcional, use `poetry install --with dev -E auto`.
Os arquivos `requirements*.txt` continuam disponíveis para execução com `pip` e
para a imagem Docker.

Instale o [Ollama](https://ollama.com/download) e baixe os modelos locais:

```powershell
ollama pull qwen3:0.6b
ollama pull embeddinggemma
```

O `.env.example` já seleciona `LLM_PROVIDER=ollama`. Nesse modo, nenhuma chave é
necessária. Para usar OpenAI, troque o provedor para `openai` e substitua
`sk-xxxxx` no `.env` por uma chave válida. Não coloque chaves no código, no corpo
de requisições ou em capturas de tela.

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8110
```

Linux/macOS: use `python3 -m venv .venv`, `.venv/bin/python` e
`cp .env.example .env` nos comandos equivalentes.

- Swagger UI: [http://127.0.0.1:8110/docs](http://127.0.0.1:8110/docs)
- ReDoc: [http://127.0.0.1:8110/redoc](http://127.0.0.1:8110/redoc)
- OpenAPI: [http://127.0.0.1:8110/openapi.json](http://127.0.0.1:8110/openapi.json)
- Saúde do servidor: [http://127.0.0.1:8110/health](http://127.0.0.1:8110/health)

A API e a documentação abrem sem chave. No modo Ollama, consultas exigem o serviço
local e os dois modelos baixados. No modo OpenAI, a ausência da chave retorna 503.

### Demonstração recomendada para o card

No Swagger, execute `POST /chat/orquestrador` com:

```json
{
  "user_input": "Quais temas aparecem nos artigos? Cite títulos e fontes disponíveis.",
  "session_id": "card11",
  "source": "arxiv"
}
```

`source=arxiv` ou `source=semantic_scholar` usa os PDFs já incluídos em
`src/files/`. São documentos de exemplo reais da base, não respostas simuladas:
embeddings, recuperação e geração são executados em cada requisição.
Depois do download dos modelos, essa demonstração funciona sem acesso externo.
Os PDFs não representam uma busca atualizada.

Para capturar **JSON com tokens e streaming em tempo real**, abra outro terminal:

```powershell
.\.venv\Scripts\python.exe scripts/demo.py --mode both --source arxiv
```

O script imprime cada fragmento com seu tempo de chegada e grava
`docs/evidencias.txt`. Esse arquivo é produzido pela execução, não preenchido com
números inventados. Uma falha gera registro de falha e código de saída diferente
de zero. Os testes offline não substituem a evidência de uma chamada real.

### Fluxo automático original (opcional)

O valor padrão `source=auto` preserva a classificação da pergunta, a escolha da API
por similaridade e a busca de novos artigos. Para usá-lo:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-auto.txt
```

Essa opção baixa modelos locais do Hugging Face na primeira execução: MiniLM para
roteamento e Falconsai para resumir abstracts. Usa mais disco e memória e depende
da disponibilidade de arXiv/Semantic Scholar. Estes modelos públicos não precisam
de chave do Hugging Face. A chave opcional `SEMANTIC_SCHOLAR_API_KEY` pode ser
configurada no `.env`.

Docker, incluindo as dependências automáticas:

```powershell
docker compose up --build
```

O Compose lê o mesmo `.env` da raiz; os segredos não são copiados para a imagem.
Para acessar o Ollama instalado no host a partir do container, defina
`OLLAMA_BASE_URL=http://host.docker.internal:11434`. A execução local sem Docker é
o caminho usado nas evidências desta entrega.

## 1. Segurança de API keys

Uma API key identifica e autoriza o acesso a um provedor remoto. O Ollama roda
localmente e não precisa de chave; a opção OpenAI usa a mesma `OPENAI_API_KEY`
para chat e embeddings. O arquivo `src/config.py` carrega o `.env` com
python-dotenv; variáveis já definidas no processo têm prioridade. O exemplo contém
apenas valores fictícios e nomes de modelos.

Variáveis usadas:

| Variável | Finalidade |
| --- | --- |
| LLM_PROVIDER | `ollama` (padrão) ou `openai` |
| OLLAMA_BASE_URL | API HTTP local; padrão http://127.0.0.1:11434 |
| OLLAMA_CHAT_MODEL | Chat local; padrão qwen3:0.6b |
| OLLAMA_EMBEDDING_MODEL | Embeddings locais; padrão embeddinggemma |
| OPENAI_API_KEY | Obrigatória somente quando o provedor é OpenAI |
| OPENAI_MODEL | Modelo de chat; padrão gpt-4o-mini |
| OPENAI_EMBEDDING_MODEL | Embeddings; padrão text-embedding-3-small |
| URL_SEMANTIC_SCHOLAR | Endpoint de busca do fluxo auto |
| SEMANTIC_SCHOLAR_API_KEY | Chave opcional da busca Semantic Scholar |

`.env` e variantes com segredos estão no `.gitignore` e no `.dockerignore`.
A exceção `!.env.example` permite versionar o exemplo.
O antigo `envs/.env.exemplo` é mantido apenas como orientação para o novo arquivo.
Logs da aplicação mostram contagens e tipos de falha, sem imprimir chaves.

Auditoria do histórico recebido da base:

```powershell
git log --all --full-history -- .env
git log --all --full-history -- envs/.env
git ls-files -- .env envs/.env
git check-ignore .env envs/.env
```

Na inspeção inicial, os três primeiros comandos não retornaram arquivos/commits,
e o último confirmou que os dois caminhos são ignorados. Isso comprova ausência
**nesses caminhos, no histórico disponível no clone**; não é uma afirmação sobre
cópias externas ou commits já removidos do servidor.

Esta demonstração local não implementa autenticação de usuários. Proteger a chave
do provedor no backend é diferente de exigir uma chave de acesso ao endpoint.
Execute em `127.0.0.1`; não publique esta API de curso como serviço aberto.

## 2. Tokens

Um token é uma unidade de texto usada pelo modelo. Pode representar uma palavra,
uma parte de palavra, pontuação ou espaço. A tokenização usa um vocabulário de
fragmentos/subpalavras: contar palavras ou caracteres não produz a mesma medida,
e a proporção varia entre idiomas e modelos.

Cada resposta JSON contém:

```json
{
  "usage": {
    "provider": "ollama",
    "model": "qwen3:0.6b",
    "input_tokens": 100,
    "output_tokens": 20,
    "total_tokens": 120,
    "llm_calls": 1,
    "counting_method": "provider"
  }
}
```

**Os números acima são ilustrativos, não uma execução real.**

- **Input:** mensagens e instruções enviadas, incluindo contexto recuperado e,
  quando usado, histórico da conversa.
- **Output:** tokens gerados pelo modelo.
- **Total:** input + output, somados para todas as chamadas de chat da requisição.
  No modo auto, inclui classificador, reformulação e resposta final.
- **llm_calls:** quantidade de chamadas de LLM concluídas.

`src/utils/token_usage.py` usa os metadados do provedor. O Ollama informa
`prompt_eval_count` e `eval_count` no último objeto da resposta; eles viram input
e output no JSON/SSE. A OpenAI fornece `usage` e, no streaming, o cliente solicita
o bloco final com `stream_usage=True`. Se a OpenAI omitir o uso em uma chamada
concluída, tiktoken estima a contagem do modelo configurado. O resultado indica
`provider`, `estimated` ou `mixed`; uma estimativa não equivale à fatura.

Os tokens dos **embeddings não estão incluídos no total de chat**: são outra
operação. Esta implementação reconstrói o índice por requisição, portanto gera
embeddings novamente. O Ollama informa essa contagem separadamente, mas o requisito
do endpoint registra especificamente input e output da LLM geradora.

Input e output podem ter preços diferentes porque o processamento do contexto
e a geração sequencial de novos tokens têm características de custo distintas,
e provedores hospedados podem definir tarifas separadas. No Ollama não há tarifa
por token: o custo aparece em tempo, CPU/GPU, memória e energia locais. Na OpenAI,
consulte o [modelo GPT-4o-mini](https://developers.openai.com/api/docs/models/gpt-4o-mini)
para as tarifas vigentes; o projeto não calcula custo monetário.

Em caso de desconexão antes do bloco final, não é garantido receber o uso completo.
Somente uma requisição concluída envia `usage` e `done`; uma interrupção pode
ter gerado cobrança mesmo sem esse registro final.

## 3. Streaming

Streaming envia a resposta aos poucos, conforme ela é gerada. A rota
`POST /chat/orquestrador/stream` usa **SSE (Server-Sent Events)** sobre HTTP.
O corpo de entrada é igual ao da rota JSON.

A API primeiro recupera o contexto e depois itera em `llm.stream()`.
Não espera a resposta completa para dividi-la artificialmente.
Os fragmentos podem conter um ou mais tokens, conforme os lotes enviados pelo provedor.

Sequência do protocolo:

1. `sources`: trechos recuperados e `rag_used`.
2. `token`: fragmento em `{"text": "..."}`, repetido durante a geração.
3. `usage`: input, output, total, chamadas e método de contagem.
4. `done`: confirmação de conclusão e identificação da sessão.

Se ocorrer falha após iniciar a resposta HTTP, o evento `error` substitui o
encerramento de sucesso; o cliente não deve confundir HTTP 200 com geração concluída.
No ramo de resposta fixa do classificador, não há geração final em streaming;
a resposta fixa é enviada em um evento, com o uso do classificador.

O script `scripts/demo.py` usa `stream=True`, leitura incremental e impressão
com flush. Os tempos crescentes permitem ver a chegada de cada fragmento.
Por ser uma rota POST, um frontend pode consumir SSE com `fetch` e
`ReadableStream`; o `EventSource` nativo usa GET. O Swagger pode acumular
a resposta e não é o melhor cliente para observar os intervalos.

O schema `StreamEvent` descreve e valida cada evento. A resposta HTTP é documentada
como `text/event-stream`, não como um JSON único.

## 4. RAG — geração com contexto recuperado

RAG significa *Retrieval-Augmented Generation*: a aplicação busca informações
antes de pedir uma resposta ao modelo.

Fluxo usado neste projeto:

1. **Documentos:** PDFs de títulos, links e resumos de artigos. No modo auto,
   arXiv ou Semantic Scholar fornece os artigos, o modelo local resume os abstracts
   e `FileGenerator` gera um PDF temporário exclusivo da requisição.
   Na demonstração, usamos os PDFs existentes em `src/files/`.
2. **Leitura e divisão:** PyMuPDF extrai texto; o splitter cria trechos de até
   1.200 caracteres com 150 de sobreposição para preservar continuidade.
3. **Embeddings:** `embeddinggemma` no Ollama (ou `text-embedding-3-small` na
   OpenAI) transforma trechos em vetores.
   FAISS mantém o índice em memória, sem banco externo.
4. **Retrieval:** a pergunta também é vetorizada. FAISS recupera até quatro
   trechos próximos; a pergunta, e não o PDF inteiro, é a consulta de busca.
5. **Geração:** o prompt recebe somente os trechos recuperados e a pergunta.
   O `qwen3:0.6b` no Ollama (ou GPT-4o-mini na OpenAI) responde citando as fontes.

Isso reduz alucinações porque a resposta tem evidências concretas e o prompt
orienta o modelo a admitir quando falta informação. **Não elimina erros**:
a busca pode recuperar conteúdo insuficiente, os resumos podem perder detalhes
e os artigos podem estar desatualizados. A resposta inclui `sources` com arquivo,
página e trecho, permitindo conferir o contexto efetivamente enviado.

No fluxo auto, uma pergunta que segue o ramo de conversa geral retorna
`rag_used=false` e `sources=[]`. Falhas na busca/RAG não são silenciosamente
convertidas em respostas de conhecimento geral.

## Endpoints e organização

| Método/rota | Resultado |
| --- | --- |
| GET /health | Estado do servidor, sem chamada à LLM |
| POST /chat/orquestrador | Resposta, fontes e consumo agregado |
| POST /chat/orquestrador/stream | Eventos SSE incrementais |
| GET /docs e /redoc | Documentação interativa e de referência |

As rotas antigas `/chat/docs` e `/chat/redoc` redirecionam para as novas páginas.
Cada rota pública tem summary, description e response_model.

```text
src/api/app.py                 metadados e documentação
src/api/routers/chat.py        endpoints JSON e SSE
src/api/schemas/chat.py        entradas, resposta, fontes e tokens
src/config.py                  .env e seleção do provedor
src/providers/ollama.py        chat, streaming e embeddings locais
src/chat/controller.py        orquestração e histórico
src/rag/generate_rag.py        recuperação FAISS e contexto
src/utils/token_usage.py       contagem por requisição
scripts/demo.py                cliente real e evidências
tests/test_api.py              validações offline
```

O histórico fica em `data/history/`, ignorado pelo Git.
A aplicação é uma demonstração de **um processo e uma requisição por vez**;
uma chamada simultânea retorna 409. Não use múltiplos workers.
O campo session_id aceita letras, números, hífen e sublinhado para impedir
que seja usado como caminho arbitrário de arquivo.

## Testes e evidências

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m pip check
```

Os testes usam respostas controladas, validam erros, schemas, isolamento e soma
de tokens, retrieval e leitura de usage no SDK. Um teste abre um socket HTTP real
e só permite a geração terminar depois que o cliente recebe o primeiro fragmento:
isso detecta buffering acidental. Não consomem créditos.

Para repetir a evidência exigida pelo card, execute o cliente com o Ollama ativo.
Confira `counting_method=provider`, contagens positivas, fontes e eventos token
com tempos distintos em `docs/evidencias.txt`. O estado da execução disponível e
suas limitações estão descritos em `docs/validacao.md`. A execução desta entrega
foi concluída com Ollama e registrou contagens reais do modelo local.

## Referências e créditos

- [Vídeo de apoio — Tech With Tim](https://www.youtube.com/watch?v=cy6EAp4iNN4):
  página, descrição e capítulos consultados; reprodução/transcrição indisponíveis
  no ambiente de consulta. [Código oficial do vídeo](https://github.com/techwithtim/API-For-Your-LLM).
- [FastAPI — OpenAPI/docs](https://fastapi.tiangolo.com/reference/openapi/docs/)
  e [metadados](https://fastapi.tiangolo.com/tutorial/metadata/).
- [OpenAI — Chat e uso no streaming](https://developers.openai.com/api/reference/resources/chat).
- [Ollama — uso](https://docs.ollama.com/api/usage),
  [chat](https://docs.ollama.com/api/chat),
  [streaming](https://docs.ollama.com/capabilities/streaming) e
  [embeddings](https://docs.ollama.com/api/embed).
- Base criada por **Felipe Lapa do Nascimento**; licença original preservada em LICENSE.
