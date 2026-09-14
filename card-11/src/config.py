"""Configuração local compartilhada por LLM, embeddings e API."""

import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env", override=False)


def require_api_key() -> str:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key or key in {"sk-xxxxx", "sua_chave_aqui"}:
        raise ValueError("Configure OPENAI_API_KEY no .env da raiz do projeto.")
    return key


def provider_name() -> str:
    provider = os.getenv("LLM_PROVIDER", "ollama").strip().lower()
    if provider not in {"ollama", "openai"}:
        raise ValueError("LLM_PROVIDER deve ser 'ollama' ou 'openai'.")
    return provider


def require_provider_configuration() -> None:
    if provider_name() == "openai":
        require_api_key()


def model_name() -> str:
    if provider_name() == "ollama":
        return os.getenv("OLLAMA_CHAT_MODEL", "qwen3:0.6b")
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def embedding_model_name() -> str:
    if provider_name() == "ollama":
        return os.getenv("OLLAMA_EMBEDDING_MODEL", "embeddinggemma")
    return os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")


def ollama_base_url() -> str:
    return os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
