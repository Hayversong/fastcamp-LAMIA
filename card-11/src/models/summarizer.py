import logging
import warnings

from src.utils.model_initializers import initialize_summa

warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.CRITICAL)


class Summarizer:
    def __init__(self):
        self.model = initialize_summa()

    def make_summarization(
        self,
        src_text: str,
        max_length: int = 200,
        min_length: int = 30,
        do_sample: bool = False,
    ) -> str:
        """
        Realiza a sumarização de um texto fornecido.

        Args:
            src_text (str): Texto original a ser sumarizado.
            max_length (int, optional): Tamanho máximo do resumo gerado. Defaults to 200.
            min_length (int, optional): Tamanho mínimo do resumo gerado. Defaults to 30.
            do_sample (bool, optional): Se deve usar amostragem na geração do resumo. Defaults to False.

        Returns:
            str: Texto sumarizado resultante.
        """
        text_to_summa = src_text[:max_length]
        result = self.model(
            text_to_summa,
            max_length=max_length,
            min_length=min_length,
            do_sample=do_sample,
        )[0].get("summary_text")
        return result
