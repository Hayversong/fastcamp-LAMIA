# SCHOLAR E OPEN TEM PARAM E ESTRUTRA IGUAL PARA QUESITAR
# TODOS TEM A MESAM FUNÇÃO DE GERAR O PDF
# A SCHOLAR E A OPEN TEM QUE FAZER O NGC DO LATIN


# A SCHOLAR TEM QUE REESTRUTURA O RESUMO

import logging
import os
import unicodedata
from typing import Any, Callable, Dict, List, Optional, Tuple

import arxiv
import requests
from fpdf import FPDF

from src.models.summarizer import Summarizer

logging.basicConfig(level=logging.DEBUG)


class FileGenerator:
    def __init__(self, tuple_similarity, query):
        self.tuple_similarity = tuple_similarity
        self.query = query
        self.summa = Summarizer()

    def clean_unicode(self, texto: str) -> str:
        """
        Remove acentuação e caracteres Unicode especiais do texto,
        normalizando para o padrão Latin-1.

        Args:
            texto (str): Texto original que pode conter caracteres Unicode.

        Returns:
            str: Texto normalizado sem acentuação e caracteres especiais.
        """
        return (
            unicodedata.normalize("NFKD", texto)
            .encode("latin-1", "ignore")
            .decode("latin-1")
        )

    def generate_fields(
        self,
        items: Dict[str, Any],
        keys: Dict[str, str],
        abstract_transform: Optional[Callable[[str], str]] = None,
        mode: str = "dict",
    ) -> List[Tuple[str, str, str]]:
        """
        Gera uma lista de tuplas contendo título, link e resumo sumarizado de artigos retornados pelas APIs.

        Args:
            items (Dict[str, Any]): Dados brutos dos artigos retornados pelas APIs.
            keys (Dict[str, str]): Mapeamento das chaves para acessar título, link e resumo nos dados dos artigos.
            abstract_transform (Callable[[str], str], optional): Função para transformar ou sumarizar o resumo. Defaults to None.
            mode (str, optional): Modo de saída, atualmente só suporta 'dict'. Defaults to 'dict'.

        Returns:
            List[Tuple[str, str, str]]: Lista de tuplas com (título, link, resumo sumarizado).
        """
        list_infos = list()
        for item in items:
            if mode == "dict":
                title = item.get(keys["title"])
                link = item.get(keys["link"])
                abstract_raw = item.get(keys["abstract"])
            elif mode == "obj":
                title = getattr(item, keys["title"], None)
                link = getattr(item, keys["link"], None)
                abstract_raw = getattr(item, keys["abstract"], None)
            else:
                raise ValueError("Invalid mode: choose 'dict' or 'obj'")

            if abstract_raw is not None and abstract_transform:
                abstract = abstract_transform(abstract_raw)
            else:
                abstract = abstract_raw

            if title and link and abstract:
                text_summa = self.summa.make_summarization(abstract, max_length=500)
                list_infos.append((title, link, text_summa))

        return list_infos

    def repair_abstract(self, inverted_index: str) -> str:
        """
        Junta partes de texto fragmentadas de um retorno de API em uma única string.

        Args:
            inverted_index (str): Texto fragmentado (abstract) a ser concatenado.

        Returns:
            str: Texto completo resultante da junção das partes.
        """
        if not inverted_index:
            return "Resumo não disponível."
        index_map = {}
        for word, positions in inverted_index.items():
            for pos in positions:
                index_map[pos] = word
        return " ".join(index_map[i] for i in sorted(index_map))

    def generate_pdf(self, list_infos: list, output_path=None):
        """
        Gera e salva PDFs na pasta "src/files/" com o nome no formato "abstracts_<nome_da_api>.pdf".

        Args:
            list_infos (List[Tuple[str, str, str]]): Lista de tuplas contendo informações dos artigos
                (título, link, resumo sumarizado).

        Returns:
            None
        """
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        for _, (title, link, abstract) in enumerate(list_infos, 1):
            pdf.set_font("Arial", style="B", size=12)
            pdf.multi_cell(0, 10, f"Title: {self.clean_unicode(title)}")
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, f"Link: {link}")
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, f"Abstract: {self.clean_unicode(abstract)}")
            pdf.ln()

        pdf.output(
            str(output_path or f"src/files/abstracts_{self.tuple_similarity[1]}.pdf")
        )

    def make_request(self) -> list:
        """
        Realiza uma requisição HTTP e retorna os dados obtidos.

        Returns:
            list: Lista com os dados retornados pela requisição.
        """
        if self.tuple_similarity[0] == 0:
            fields_semanticscholar = {
                "title": "title",
                "link": "url",
                "abstract": "abstract",
            }

            url = os.getenv(
                "URL_SEMANTIC_SCHOLAR",
                "https://api.semanticscholar.org/graph/v1/paper/search",
            )
            params = {"query": self.query, "limit": 5, "fields": "title,abstract,url"}

            key = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
            headers = {"x-api-key": key} if key else {}
            http_response = requests.get(
                url, params=params, headers=headers, timeout=30
            )
            http_response.raise_for_status()
            response = http_response.json()

            results = self.generate_fields(
                items=response["data"], keys=fields_semanticscholar, mode="dict"
            )
        elif self.tuple_similarity[0] == 1:
            fields_arxiv = {"title": "title", "link": "entry_id", "abstract": "summary"}

            search = arxiv.Search(
                query=self.query,
                max_results=5,
                sort_by=arxiv.SortCriterion.SubmittedDate,
            )

            results = self.generate_fields(
                items=search.results(), keys=fields_arxiv, mode="obj"
            )

        return results
