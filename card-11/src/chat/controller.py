"""Orquestra o fluxo original e compartilha a preparação entre JSON e SSE."""

import logging
import re
from pathlib import Path
from tempfile import TemporaryDirectory

from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_message_histories import FileChatMessageHistory
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.prompts import ChatPromptTemplate

from src.api.schemas.chat import ChatResponse
from src.config import ROOT
from src.models.classifier import Classificador
from src.rag.generate_rag import RAG
from src.utils.func_aux import Auxiliar
from src.utils.model_initializers import initialize_gpt4o
from src.utils.token_usage import TokenTracker

logger = logging.getLogger(__name__)


class ChatController:
    def __init__(self, session_id="default_session"):
        if not re.fullmatch(r"[a-zA-Z0-9_-]{1,64}", session_id):
            raise ValueError("session_id inválido.")
        self.session_id = session_id
        self.aux = Auxiliar()
        self.llm = initialize_gpt4o()
        self.classi = Classificador()
        self.flow = None
        history_dir = ROOT / "data" / "history"
        history_dir.mkdir(parents=True, exist_ok=True)
        self.memory = ConversationBufferWindowMemory(
            k=3,
            chat_memory=FileChatMessageHistory(str(history_dir / f"{session_id}.json")),
            memory_key="memory",
            return_messages=False,
        )

    def normal_prompt(self, user_input):
        return ChatPromptTemplate.from_template(
            self.aux.load_prompt("normal_flow.md")
        ).invoke({"memory": self.memory.buffer, "user_input": user_input})

    def prepare(self, user_input, source, config):
        if source != "auto":
            prompt, sources = RAG((0, source)).prepare(user_input)
            return prompt, sources, None

        if not self.classi.make_classification(
            user_input, self.memory.buffer, config=config
        ):
            return None, [], "Não entendi sua pergunta. Poderia repetir?"

        from src.flow.flow_deciosion import MakeFlow
        from src.utils.files_generator import FileGenerator

        if self.flow is None:
            self.flow = MakeFlow()
        choice = self.flow.return_flow(self.flow.make_similarities(user_input))
        improved = self.llm.invoke(
            ChatPromptTemplate.from_template(
                self.aux.load_prompt("improve_input_quality.md")
            ).invoke({
                "api": choice[1],
                "memory": self.memory.buffer,
                "user_input": user_input,
            }),
            config=config,
        ).content.strip()
        if improved == "0":
            return self.normal_prompt(user_input), [], None

        # Cada busca tem seu próprio PDF: não sobrescreve as amostras nem outra sessão.
        with TemporaryDirectory(prefix="rag-") as directory:
            generator = FileGenerator(choice, improved)
            results = generator.make_request()
            if not results:
                raise ValueError("A busca não retornou artigos com resumo.")
            path = Path(directory) / f"abstracts_{choice[1]}.pdf"
            generator.generate_pdf(results, output_path=path)
            documents = PyMuPDFLoader(str(path)).load()
        prompt, sources = RAG(choice).prepare(user_input, data=documents)
        return prompt, sources, None

    def _complete(self, user_input, text, sources, tracker):
        self.memory.save_context({"input": user_input}, {"output": text})
        usage = tracker.snapshot()
        logger.info(
            "tokens session=%s input=%s output=%s total=%s calls=%s method=%s",
            self.session_id,
            usage.input_tokens,
            usage.output_tokens,
            usage.total_tokens,
            usage.llm_calls,
            usage.counting_method,
        )
        return ChatResponse(
            session_id=self.session_id,
            response=text,
            usage=usage,
            sources=sources,
            rag_used=bool(sources),
        )

    def run(self, user_input="", source="auto"):
        tracker = TokenTracker()
        config = {"callbacks": [tracker]}
        prompt, sources, fixed = self.prepare(user_input, source, config)
        text = (
            fixed
            if fixed is not None
            else self.llm.invoke(prompt, config=config).content
        )
        return self._complete(user_input, text, sources, tracker)

    def stream(self, user_input, source="auto"):
        tracker = TokenTracker()
        config = {"callbacks": [tracker]}
        prompt, sources, fixed = self.prepare(user_input, source, config)
        yield {
            "event": "sources",
            "data": {
                "sources": [s.model_dump() for s in sources],
                "rag_used": bool(sources),
            },
        }
        parts = []
        if fixed is not None:
            parts.append(fixed)
            yield {"event": "token", "data": {"text": fixed}}
        else:
            # Não divide uma resposta pronta: cada fragmento vem do stream do provedor.
            with_stream = self.llm.stream(prompt, config=config)
            try:
                for chunk in with_stream:
                    if chunk.content:
                        parts.append(chunk.content)
                        yield {"event": "token", "data": {"text": chunk.content}}
            finally:
                with_stream.close()
        result = self._complete(user_input, "".join(parts), sources, tracker)
        yield {"event": "usage", "data": result.usage.model_dump()}
        yield {"event": "done", "data": {"session_id": self.session_id}}
