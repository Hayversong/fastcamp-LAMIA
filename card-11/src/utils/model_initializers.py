from langchain_openai import ChatOpenAI

from src.config import model_name, provider_name, require_api_key


def initialize_gpt4o():
    if provider_name() == "ollama":
        from src.providers.ollama import OllamaChat

        return OllamaChat()
    return ChatOpenAI(
        model=model_name(),
        api_key=require_api_key(),
        temperature=0.2,
        stream_usage=True,
        timeout=60,
        max_retries=1,
        max_tokens=1200,
    )


def initialize_summa():
    # Modelos locais pesados são carregados apenas no fluxo automático original.
    from transformers import pipeline

    return pipeline("summarization", model="Falconsai/text_summarization")


def initialize_minilm():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer("all-MiniLM-L6-v2")
