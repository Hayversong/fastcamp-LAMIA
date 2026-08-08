from api.games.models.game_model import Jogo


class RepositorioJogos:
    """Armazenamento de jogos em memória."""

    def __init__(self) -> None:
        self._jogos: list[Jogo] = []
        self._proximo_id = 1

    def criar(self, jogo: Jogo) -> Jogo:
        self._jogos.append(jogo)
        self._proximo_id += 1
        return jogo

    def proximo_id(self) -> int:
        return self._proximo_id

    def listar(self) -> list[Jogo]:
        return list(self._jogos)

    def buscar_por_id(self, jogo_id: int) -> Jogo | None:
        return next((jogo for jogo in self._jogos if jogo.id == jogo_id), None)

    def atualizar(self, jogo: Jogo) -> Jogo:
        for indice, jogo_armazenado in enumerate(self._jogos):
            if jogo_armazenado.id == jogo.id:
                self._jogos[indice] = jogo
                return jogo
        raise ValueError("Jogo não existe")

    def remover(self, jogo_id: int) -> bool:
        for indice, jogo in enumerate(self._jogos):
            if jogo.id == jogo_id:
                del self._jogos[indice]
                return True
        return False

    def reiniciar(self) -> None:
        self._jogos.clear()
        self._proximo_id = 1
