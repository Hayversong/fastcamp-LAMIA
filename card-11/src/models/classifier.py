from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from src.utils.func_aux import Auxiliar
from src.utils.model_initializers import initialize_gpt4o


class Classificador:
    def __init__(self):
        self.aux = Auxiliar()
        self.llm = initialize_gpt4o()

    def make_classification(self, user_input: str, memory, config=None) -> bool:
        """
        Classifica a entrada do usuário e retorna um valor booleano com base na categoria atribuída.

        Args:
            user_input (str): Entrada textual fornecida pelo usuário.

        Returns:
            bool: True se a entrada for classificada como relevante (classe 1),
                False caso contrário (classe 0 ou 2).
        """
        prompt = self.aux.load_prompt("context_classifier.md")

        prompt = ChatPromptTemplate.from_template(prompt)
        prompt_val = prompt.invoke({"user_input": user_input, "memory": memory})
        output = self.llm.invoke(prompt_val, config=config)
        response_bool = StrOutputParser().invoke(output).strip() not in ["0", "2"]

        return response_bool
