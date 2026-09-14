"""Adaptadores mínimos para a API HTTP local do Ollama."""

import json

import requests
from langchain_core.embeddings import Embeddings
from langchain_core.messages import AIMessage, AIMessageChunk

from src.config import embedding_model_name, model_name, ollama_base_url


def _messages(prompt_value):
    role_map = {"human": "user", "ai": "assistant", "system": "system"}
    messages = getattr(prompt_value, "messages", None)
    if messages is None:
        messages = [
            type("Message", (), {"type": "human", "content": str(prompt_value)})()
        ]
    return [
        {
            "role": role_map.get(message.type, message.type),
            "content": str(message.content),
        }
        for message in messages
    ]


def _record(config, payload):
    for callback in (config or {}).get("callbacks", []):
        record = getattr(callback, "record_usage", None)
        if record:
            record(payload.get("prompt_eval_count", 0), payload.get("eval_count", 0))


class OllamaChat:
    def __init__(self):
        self.url = f"{ollama_base_url()}/api/chat"
        self.model = model_name()

    def _payload(self, prompt_value, stream):
        return {
            "model": self.model,
            "messages": _messages(prompt_value),
            "stream": stream,
            "think": False,
            "options": {"temperature": 0.2, "num_predict": 1200},
        }

    def invoke(self, prompt_value, config=None):
        response = requests.post(
            self.url, json=self._payload(prompt_value, False), timeout=(5, 300)
        )
        response.raise_for_status()
        payload = response.json()
        _record(config, payload)
        input_tokens = payload.get("prompt_eval_count", 0)
        output_tokens = payload.get("eval_count", 0)
        return AIMessage(
            content=payload["message"]["content"],
            usage_metadata={
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens,
            },
        )

    def stream(self, prompt_value, config=None):
        with requests.post(
            self.url,
            json=self._payload(prompt_value, True),
            stream=True,
            timeout=(5, 300),
        ) as response:
            response.raise_for_status()
            final_payload = None
            for line in response.iter_lines(decode_unicode=True):
                if not line:
                    continue
                payload = json.loads(line)
                content = payload.get("message", {}).get("content", "")
                if content:
                    yield AIMessageChunk(content=content)
                if payload.get("done"):
                    final_payload = payload
            if final_payload is None:
                raise RuntimeError(
                    "O stream do Ollama terminou sem o evento final de uso."
                )
            _record(config, final_payload)


class OllamaEmbeddings(Embeddings):
    def __init__(self):
        self.url = f"{ollama_base_url()}/api/embed"
        self.model = embedding_model_name()

    def _embed(self, texts):
        response = requests.post(
            self.url,
            json={"model": self.model, "input": texts, "truncate": True},
            timeout=(5, 300),
        )
        response.raise_for_status()
        return response.json()["embeddings"]

    def embed_documents(self, texts):
        return self._embed(texts)

    def embed_query(self, text):
        return self._embed([text])[0]
