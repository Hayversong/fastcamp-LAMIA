# Validação da entrega

Data: 14/09/2026 (America/Sao_Paulo).

## Validação offline concluída

Comandos executados:

```powershell
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m pip check
```

Resultado: `13 passed`; `No broken requirements found`.

Os testes cobrem metadados OpenAPI, `/docs`, `/redoc`, validação das entradas,
respostas JSON, sequência e falha dos eventos SSE, liberação do bloqueio entre
requisições, soma e isolamento de tokens, leitura de `usage` pelo SDK e consulta
do retriever com a pergunta. Um teste abre uma conexão HTTP real local e confirma
que o primeiro fragmento chega ao cliente antes de a geração terminar.

## Evidência real com Ollama

Depois de a opção OpenAI informar `credit_balance_exhausted`, o Ollama 0.34.0 foi
instalado com `qwen3:0.6b` para chat e `embeddinggemma` para embeddings. A execução
local concluiu o RAG, uma resposta JSON e outra resposta SSE.

Resultado JSON:

- input: 730 tokens;
- output: 194 tokens;
- total: 924 tokens;
- método: contagem do provedor Ollama.

Resultado SSE:

- primeiro fragmento de texto: +0,891 s;
- último fragmento de texto: +8,484 s;
- evento de uso e conclusão: +8,531 s;
- input: 730, output: 287, total: 1.017 tokens.

As duas gerações podem ter quantidades de output diferentes porque a geração é
probabilística. O arquivo `docs/evidencias.txt` contém o registro completo, incluindo
fontes recuperadas e fragmentos recebidos em tempo real.

Para repetir:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8110
.\.venv\Scripts\python.exe scripts/demo.py --mode both --source arxiv
```

O script substitui `docs/evidencias.txt`, exige contagens positivas e só termina
com sucesso depois de receber o evento `done` do streaming.

## Auditoria de segredo

Os comandos abaixo não encontraram `.env` nem `envs/.env` no histórico ou nos
arquivos rastreados do clone:

```powershell
git log --all --full-history -- .env
git log --all --full-history -- envs/.env
git ls-files -- .env envs/.env
```

`git check-ignore -v .env envs/.env` confirmou que ambos são ignorados pela regra
`.env` do `.gitignore`. A verificação se limita ao histórico disponível neste clone.
