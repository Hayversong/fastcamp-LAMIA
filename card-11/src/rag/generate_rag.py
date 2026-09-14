"""RAG original: PDF → trechos → embeddings → FAISS → LLM."""

from pathlib import Path

from langchain_community.vectorstores.faiss import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.api.schemas.chat import SourceDocument
from src.config import embedding_model_name, provider_name, require_api_key
from src.utils.func_aux import Auxiliar
from src.utils.model_initializers import initialize_gpt4o


class RAG:
    def __init__(self, tuple_similarity):
        self.aux = Auxiliar()
        self.name = tuple_similarity[1]

    def pdf_to_vector(self, data):
        if provider_name() == "ollama":
            from src.providers.ollama import OllamaEmbeddings

            embeddings = OllamaEmbeddings()
        else:
            embeddings = OpenAIEmbeddings(
                model=embedding_model_name(),
                api_key=require_api_key(),
                request_timeout=60,
                max_retries=1,
            )
        splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
        documents = splitter.split_documents(data)
        if not documents:
            raise ValueError("O PDF não contém texto para recuperar.")
        return FAISS.from_documents(documents, embeddings).as_retriever(
            search_kwargs={"k": 4}
        )

    def prepare(self, question, data=None):
        data = self.aux.load_pdf(self.name) if data is None else data
        documents = self.pdf_to_vector(data).invoke(question)
        sources = [
            SourceDocument(
                file=Path(doc.metadata.get("source", self.name)).name,
                page=int(doc.metadata.get("page", 0)) + 1,
                excerpt=doc.page_content,
            )
            for doc in documents
        ]
        context = "\n\n".join(
            f"[{i}] {s.file}, página {s.page}\n{s.excerpt}"
            for i, s in enumerate(sources, 1)
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", self.aux.load_prompt("rag.md")),
            ("human", "{question}"),
        ]).invoke({"context": context, "question": question})
        return prompt, sources

    def generate_response(self, question, config=None):
        prompt, sources = self.prepare(question)
        answer = initialize_gpt4o().invoke(prompt, config=config)
        return answer.content, sources
