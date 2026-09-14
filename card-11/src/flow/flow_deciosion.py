import torch

from src.utils.func_aux import Auxiliar
from src.utils.model_initializers import initialize_minilm


class MakeFlow:
    def __init__(self):
        self.model = initialize_minilm()
        aux = Auxiliar()
        api_definition = aux.load_prompt("api_definitions.json")
        self.definition = [definition for definition in api_definition.values()]
        self.names = [names for names in api_definition]

    def make_similarities(self, user_input: str):
        """
        Calcula a similaridade entre embeddings com base na entrada do usuário.

        Args:
            user_input (str): Entrada textual fornecida pelo usuário.

        Returns:
            np.ndarray: Matriz de similaridade entre os embeddings.
        """

        embeddings = self.model.encode(user_input)
        embedding_comparar = self.model.encode(self.definition)
        similaridades = self.model.similarity(embeddings, embedding_comparar)
        return similaridades

    def return_flow(self, similarities) -> tuple[int, str]:
        """
        Escolhe a API com maior valor de similaridade na matriz fornecida.

        Args:
            similarities (np.ndarray): Matriz de similaridades entre a entrada do usuário e as APIs disponíveis.

        Returns:
            tuple[int, str]: Índice da API escolhida e seu respectivo nome.
        """
        _, idx = torch.max(similarities, dim=1)
        return (idx.item(), self.names[idx])
