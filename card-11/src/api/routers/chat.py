import json
import logging
from threading import Lock

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from starlette.concurrency import run_in_threadpool

from src.api.schemas.chat import ChatRequest, ChatResponse, StreamEvent
from src.chat.controller import ChatController
from src.config import require_provider_configuration

logger = logging.getLogger(__name__)
chat_router = APIRouter(tags=["Chat"])
active_sessions = {}
# A demonstração local aceita uma requisição por vez para preservar o histórico.
request_lock = Lock()


def get_chat_controller(session_id):
    if session_id not in active_sessions:
        active_sessions[session_id] = ChatController(session_id=session_id)
    return active_sessions[session_id]


def begin_request():
    try:
        require_provider_configuration()
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    if not request_lock.acquire(blocking=False):
        raise HTTPException(
            status_code=409, detail="Aguarde a requisição atual terminar."
        )


@chat_router.post(
    "/orquestrador",
    response_model=ChatResponse,
    summary="Consultar o assistente e contar tokens",
    description="Executa o fluxo de pesquisa e retorna resposta, fontes e uso agregado de todas "
    "as chamadas de LLM. source=arxiv ou semantic_scholar consulta PDFs locais; "
    "source=auto busca novos artigos. O uso de embeddings não integra a contagem do chat.",
    responses={
        409: {"description": "Outra requisição em andamento"},
        503: {"description": "Provedor não configurado"},
        502: {"description": "Falha no processamento"},
    },
)
async def chat_endpoint(request: ChatRequest):
    begin_request()
    try:

        def execute():
            return get_chat_controller(request.session_id).run(
                request.user_input, request.source
            )

        return await run_in_threadpool(execute)
    except Exception as exc:
        logger.error("Falha de chat: %s", type(exc).__name__)
        raise HTTPException(
            status_code=502,
            detail="Falha ao consultar modelos ou documentos. Verifique a configuração e tente novamente.",
        )
    finally:
        request_lock.release()


@chat_router.post(
    "/orquestrador/stream",
    response_model=StreamEvent,
    response_class=StreamingResponse,
    summary="Consultar o assistente com streaming SSE",
    description="""Envia eventos text/event-stream conforme a resposta é gerada.
Cada evento tem linhas event: <tipo> e data: <JSON>, seguidas de uma linha vazia.
sources: {sources: [...], rag_used: bool}; token: {text: fragmento};
usage: {provider, model, input_tokens, output_tokens, total_tokens, llm_calls, counting_method};
done: {session_id}; error: {message}.
O response_model descreve um evento, não um JSON único. A transmissão é validada
evento a evento. Um fragmento pode conter mais de um token.
Após os cabeçalhos HTTP 200, falhas são sinalizadas por error, sem done.
Use o script de demonstração; o Swagger pode acumular o conteúdo antes de exibi-lo.""",
    responses={
        200: {
            "content": {
                "text/event-stream": {
                    "schema": {"type": "string"},
                    "example": 'event: token\ndata: {"text":"Olá"}\n\n',
                }
            },
            "description": "Fluxo de eventos SSE",
        },
        409: {"description": "Outra requisição em andamento"},
        503: {"description": "Provedor não configurado"},
    },
)
async def chat_stream(request: ChatRequest):
    begin_request()

    async def events():
        iterator = None
        try:
            controller = await run_in_threadpool(
                get_chat_controller, request.session_id
            )
            iterator = controller.stream(request.user_input, request.source)
            sentinel = object()
            while True:
                event = await run_in_threadpool(next, iterator, sentinel)
                if event is sentinel:
                    break
                checked = StreamEvent.model_validate(event)
                yield f"event: {checked.event}\ndata: {json.dumps(checked.data, ensure_ascii=False)}\n\n"
        except Exception as exc:
            logger.error("Falha de streaming: %s", type(exc).__name__)
            yield 'event: error\ndata: {"message":"Falha ao consultar modelos ou documentos."}\n\n'
        finally:
            if iterator is not None:
                iterator.close()
            request_lock.release()

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
