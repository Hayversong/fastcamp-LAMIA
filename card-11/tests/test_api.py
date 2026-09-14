"""Testes offline: nenhum teste deste arquivo consome a API real."""

import json
import threading
import time
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.outputs import ChatGeneration, LLMResult
from langchain_openai import ChatOpenAI

from src.api.app import create_app
from src.api.routers import chat
from src.api.schemas.chat import ChatResponse, TokenUsage
from src.utils.token_usage import TokenTracker


def result():
    return ChatResponse(
        session_id="test",
        response="Olá mundo",
        usage=TokenUsage(
            provider="ollama",
            model="qwen3:0.6b",
            input_tokens=10,
            output_tokens=2,
            total_tokens=12,
            llm_calls=1,
            counting_method="provider",
        ),
        sources=[],
        rag_used=False,
    )


class FakeController:
    def run(self, *args):
        return result()

    def stream(self, *args):
        yield {"event": "token", "data": {"text": "Olá"}}
        yield {"event": "token", "data": {"text": " mundo"}}
        yield {"event": "usage", "data": result().usage.model_dump()}
        yield {"event": "done", "data": {"session_id": "test"}}


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "fake-test-key")
    monkeypatch.setattr(chat, "get_chat_controller", lambda _: FakeController())
    with TestClient(create_app()) as client:
        yield client


def test_json_and_metadata(client):
    response = client.post(
        "/chat/orquestrador", json={"user_input": "Pergunta", "source": "arxiv"}
    )
    assert response.status_code == 200
    assert response.json()["usage"]["total_tokens"] == 12
    schema = client.get("/openapi.json").json()
    for path in ("/chat/orquestrador", "/chat/orquestrador/stream"):
        route = schema["paths"][path]["post"]
        assert route["summary"] and route["description"]
    assert (
        "text/event-stream"
        in schema["paths"]["/chat/orquestrador/stream"]["post"]["responses"]["200"][
            "content"
        ]
    )
    assert client.get("/docs").status_code == client.get("/redoc").status_code == 200
    assert client.get("/health").json() == {"status": "ok"}


@pytest.mark.parametrize(
    "payload",
    [
        {"user_input": "   "},
        {"user_input": "ok", "session_id": "../../secret"},
        {"user_input": "ok", "source": "unknown"},
    ],
)
def test_invalid_input(client, payload):
    assert client.post("/chat/orquestrador", json=payload).status_code == 422


def test_missing_key(client, monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")
    monkeypatch.delenv("OPENAI_API_KEY")
    assert (
        client.post("/chat/orquestrador", json={"user_input": "ok"}).status_code == 503
    )


def test_sse_events(client):
    response = client.post("/chat/orquestrador/stream", json={"user_input": "ok"})
    assert response.headers["content-type"].startswith("text/event-stream")
    assert (
        response.text.index("event: token")
        < response.text.index("event: usage")
        < response.text.index("event: done")
    )
    assert "Olá" in response.text
    assert not chat.request_lock.locked()


def test_stream_failure_is_not_success(client, monkeypatch):
    class Broken(FakeController):
        def stream(self, *args):
            yield {"event": "token", "data": {"text": "partial"}}
            raise RuntimeError("must-not-leak-secret")

    monkeypatch.setattr(chat, "get_chat_controller", lambda _: Broken())
    response = client.post("/chat/orquestrador/stream", json={"user_input": "ok"})
    assert "event: error" in response.text and "event: done" not in response.text
    assert "must-not-leak-secret" not in response.text
    assert not chat.request_lock.locked()


def test_busy(client):
    chat.request_lock.acquire()
    try:
        assert (
            client.post("/chat/orquestrador", json={"user_input": "ok"}).status_code
            == 409
        )
    finally:
        chat.request_lock.release()


def test_provider_usage_aggregated_and_isolated():
    tracker = TokenTracker()
    for input_tokens, output_tokens in [(7, 3), (11, 5)]:
        run_id = uuid4()
        tracker.on_chat_model_start({}, [[HumanMessage(content="test")]], run_id=run_id)
        tracker.on_llm_end(
            LLMResult(
                generations=[
                    [
                        ChatGeneration(
                            message=AIMessage(
                                content="answer",
                                usage_metadata={
                                    "input_tokens": input_tokens,
                                    "output_tokens": output_tokens,
                                    "total_tokens": input_tokens + output_tokens,
                                },
                            )
                        )
                    ]
                ]
            ),
            run_id=run_id,
        )
    assert tracker.snapshot().total_tokens == 26
    assert tracker.snapshot().llm_calls == 2
    assert TokenTracker().snapshot().total_tokens == 0


def test_estimated_usage_is_identified(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")

    class Encoding:
        def encode(self, value, **kwargs):
            return value.split()

    monkeypatch.setattr("tiktoken.encoding_for_model", lambda _: Encoding())
    tracker = TokenTracker()
    run_id = uuid4()
    tracker.on_chat_model_start({}, [[HumanMessage(content="teste")]], run_id=run_id)
    tracker.on_llm_end(
        LLMResult(
            generations=[[ChatGeneration(message=AIMessage(content="resposta"))]]
        ),
        run_id=run_id,
    )
    assert tracker.snapshot().counting_method == "estimated"


def test_real_sdk_reads_stream_usage(monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER", "openai")

    def transport(request):
        body = json.loads(request.content)
        assert body["stream_options"]["include_usage"] is True
        base = {
            "id": "test",
            "object": "chat.completion.chunk",
            "created": 1,
            "model": "gpt-4o-mini",
        }
        chunks = [
            dict(
                base,
                choices=[
                    {
                        "index": 0,
                        "delta": {"role": "assistant", "content": "Olá"},
                        "finish_reason": None,
                    }
                ],
            ),
            dict(base, choices=[{"index": 0, "delta": {}, "finish_reason": "stop"}]),
            dict(
                base,
                choices=[],
                usage={"prompt_tokens": 9, "completion_tokens": 1, "total_tokens": 10},
            ),
        ]
        data = (
            "".join("data: " + json.dumps(c) + "\n\n" for c in chunks)
            + "data: [DONE]\n\n"
        )
        return httpx.Response(
            200, text=data, headers={"content-type": "text/event-stream"}
        )

    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key="fake",
        stream_usage=True,
        http_client=httpx.Client(transport=httpx.MockTransport(transport)),
    )
    tracker = TokenTracker()
    chunks = list(llm.stream("Olá", config={"callbacks": [tracker]}))
    assert "".join(c.content for c in chunks) == "Olá"
    assert tracker.snapshot().model_dump() == dict(
        provider="openai",
        model="gpt-4o-mini",
        input_tokens=9,
        output_tokens=1,
        total_tokens=10,
        llm_calls=1,
        counting_method="provider",
    )


def test_retrieval_uses_question_and_only_selected_context(monkeypatch):
    from langchain_core.documents import Document

    from src.rag.generate_rag import RAG

    rag = RAG((0, "arxiv"))

    class Retriever:
        def invoke(self, query):
            assert query == "Qual o resultado?"
            return [
                Document(
                    page_content="Evidência selecionada",
                    metadata={"source": "sample.pdf", "page": 2},
                )
            ]

    monkeypatch.setattr(rag, "pdf_to_vector", lambda _: Retriever())
    prompt, sources = rag.prepare("Qual o resultado?", data=["documentos"])
    assert "Evidência selecionada" in prompt.to_string()
    assert "Qual o resultado?" in prompt.to_string()
    assert sources[0].page == 3


def test_sse_arrives_before_generation_finishes(monkeypatch):
    # Teste via socket real: TestClient sozinho pode acumular o corpo inteiro.
    import socket

    import uvicorn

    first_received = threading.Event()

    class LiveController(FakeController):
        def stream(self, *args):
            yield {"event": "token", "data": {"text": "primeiro"}}
            assert first_received.wait(5), (
                "Cliente não recebeu o primeiro fragmento em tempo real"
            )
            yield {"event": "done", "data": {"session_id": "live"}}

    monkeypatch.setenv("OPENAI_API_KEY", "fake-test-key")
    monkeypatch.setattr(chat, "get_chat_controller", lambda _: LiveController())
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    server = uvicorn.Server(uvicorn.Config(create_app(), log_level="error"))
    thread = threading.Thread(
        target=server.run, kwargs={"sockets": [sock]}, daemon=True
    )
    thread.start()
    try:
        deadline = time.monotonic() + 5
        while not server.started and time.monotonic() < deadline:
            time.sleep(0.01)
        assert server.started
        with httpx.stream(
            "POST",
            f"http://127.0.0.1:{port}/chat/orquestrador/stream",
            json={"user_input": "ok"},
            timeout=10,
        ) as response:
            lines = []
            for line in response.iter_lines():
                lines.append(line)
                if "primeiro" in line:
                    first_received.set()
            assert "event: done" in lines
    finally:
        first_received.set()
        server.should_exit = True
        thread.join(timeout=10)
        sock.close()
