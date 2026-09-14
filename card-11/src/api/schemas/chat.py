from typing import Literal

from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    user_input: str = Field(
        min_length=1, max_length=8000, description="Pergunta sobre os artigos."
    )
    session_id: str = Field(default="default_session", pattern=r"^[a-zA-Z0-9_-]{1,64}$")
    source: Literal["auto", "arxiv", "semantic_scholar"] = Field(
        default="auto",
        description="auto busca novos artigos; as outras opções consultam os PDFs incluídos no projeto.",
    )

    @field_validator("user_input")
    @classmethod
    def not_blank(cls, value):
        if not value.strip():
            raise ValueError("A pergunta não pode ser vazia.")
        return value.strip()


class TokenUsage(BaseModel):
    provider: Literal["ollama", "openai"]
    model: str
    input_tokens: int = Field(ge=0)
    output_tokens: int = Field(ge=0)
    total_tokens: int = Field(ge=0)
    llm_calls: int = Field(
        ge=0, description="Chamadas de LLM concluídas nesta requisição."
    )
    counting_method: Literal["provider", "estimated", "mixed", "none"]


class SourceDocument(BaseModel):
    file: str
    page: int = Field(description="Página do PDF, começando em 1.")
    excerpt: str = Field(description="Trecho recuperado enviado ao modelo.")


class ChatResponse(BaseModel):
    session_id: str
    response: str
    usage: TokenUsage
    sources: list[SourceDocument] = Field(default_factory=list)
    rag_used: bool


class StreamEvent(BaseModel):
    event: Literal["sources", "token", "usage", "done", "error"]
    data: dict = Field(
        description="JSON do evento SSE; veja os payloads na descrição da rota."
    )


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
