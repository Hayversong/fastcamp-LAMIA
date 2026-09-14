import logging

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from src.api.routers.chat import chat_router
from src.api.schemas.chat import HealthResponse

logging.basicConfig(level=logging.INFO)
# Evita logs HTTP detalhados, prompts e credenciais.
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)


class AppFactory:
    def __init__(self):
        self.app = FastAPI(
            title="Assistente de Pesquisa Científica — RAG",
            description="Demonstração didática de configuração segura, contagem de tokens, "
            "streaming SSE e recuperação de documentos (RAG), com Ollama local "
            "ou OpenAI. "
            "Para usar os PDFs de demonstração sem buscar artigos externos, "
            "selecione source=arxiv ou source=semantic_scholar.",
            version="2.1.0",
            docs_url="/docs",
            redoc_url="/redoc",
            openapi_tags=[
                {
                    "name": "Chat",
                    "description": "Respostas com fontes e consumo de tokens.",
                },
                {"name": "Status", "description": "Verificação local do servidor."},
            ],
        )
        self.app.include_router(chat_router, prefix="/chat")

        @self.app.get("/", include_in_schema=False)
        @self.app.get("/chat", include_in_schema=False)
        @self.app.get("/chat/docs", include_in_schema=False)
        def redirect_to_docs():
            return RedirectResponse("/docs")

        @self.app.get("/chat/redoc", include_in_schema=False)
        def redirect_to_redoc():
            return RedirectResponse("/redoc")

        @self.app.get(
            "/health",
            tags=["Status"],
            response_model=HealthResponse,
            summary="Verificar o servidor",
            description="Confirma que o servidor responde. Não chama nem valida a conexão com a LLM.",
        )
        def health():
            return HealthResponse()

    def get_app(self):
        return self.app


def create_app():
    return AppFactory().get_app()
