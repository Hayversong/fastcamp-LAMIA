import json
import os

from langchain_community.document_loaders import PyMuPDFLoader


class Auxiliar:
    def load_prompt(self, name: str):
        """
        Carrega um arquivo de prompt (.json ou .md) da pasta 'prompts'.

        Args:
            name (str): Nome do arquivo de prompt (ex: 'meu_prompt.json' ou 'meu_prompt.md').

        Returns:
            Union[dict, str]: Conteúdo do arquivo. Um dicionário se for JSON, ou uma string se for Markdown.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "..", "prompts", name)
        file_path = os.path.normpath(file_path)

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Arquivo '{file_path}' não encontrado.")

        if name.endswith(".json"):
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        elif name.endswith(".md"):
            with open(file_path, "r", encoding="utf-8") as f:
                file = f.read()
            if isinstance(file, bytes):
                return file.decode("utf-8")
            else:
                return file
        else:
            raise ValueError("Formato de arquivo não suportado. Use '.json' ou '.md'.")

    def load_pdf(self, name) -> dict:
        """
        Carrega o conteúdo de um PDF localizado na pasta 'files' com prefixo 'abstracts_'.

        Args:
            name (str): Nome base do arquivo PDF (sem prefixo).

        Returns:
            Dict: Dados extraídos do PDF via PyMuPDFLoader.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "..", "files", f"abstracts_{name}.pdf")
        file_path = os.path.normpath(file_path)

        loader = PyMuPDFLoader(file_path)
        data = loader.load()
        return data
