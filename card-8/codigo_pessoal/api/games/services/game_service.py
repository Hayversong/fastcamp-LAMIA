from api.games.models.game_model import Jogo, StatusJogo
from api.games.repositories.game_repository import RepositorioJogos
from api.games.schemas.game_schema import JogoAtualizacao, JogoAtualizacaoProgresso, JogoCriacao


class JogoNaoEncontradoErro(Exception):
    pass


class JogoDuplicadoErro(Exception):
    pass


class ServicoJogos:
    def __init__(self, repositorio: RepositorioJogos) -> None:
        self._repositorio = repositorio

    def criar(self, dados: JogoCriacao) -> Jogo:
        self._garantir_unicidade(dados.titulo, dados.plataforma)
        jogo = Jogo(id=self._repositorio.proximo_id(), **dados.model_dump())
        return self._repositorio.criar(jogo)

    def listar(self, status: StatusJogo | None = None, plataforma: str | None = None) -> list[Jogo]:
        jogos = self._repositorio.listar()
        if status is not None:
            jogos = [jogo for jogo in jogos if jogo.status == status]
        if plataforma is not None:
            plataforma_normalizada = plataforma.strip().casefold()
            jogos = [jogo for jogo in jogos if jogo.plataforma.casefold() == plataforma_normalizada]
        return jogos

    def buscar_por_id(self, jogo_id: int) -> Jogo:
        return self._buscar_existente(jogo_id)

    def atualizar(self, jogo_id: int, dados: JogoAtualizacao) -> Jogo:
        jogo = self._buscar_existente(jogo_id)
        self._garantir_unicidade(dados.titulo, dados.plataforma, id_jogo_ignorado=jogo.id)
        jogo_atualizado = jogo.model_copy(update=dados.model_dump())
        return self._repositorio.atualizar(jogo_atualizado)

    def atualizar_progresso(self, jogo_id: int, dados: JogoAtualizacaoProgresso) -> Jogo:
        jogo = self._buscar_existente(jogo_id)
        atualizacoes = dados.model_dump(exclude_unset=True)
        jogo_atualizado = jogo.model_copy(update=atualizacoes)
        return self._repositorio.atualizar(jogo_atualizado)

    def remover(self, jogo_id: int) -> None:
        if not self._repositorio.remover(jogo_id):
            raise JogoNaoEncontradoErro

    def resumo(self) -> dict[str, int | float | dict[StatusJogo, int]]:
        jogos = self._repositorio.listar()
        jogos_por_status = {status: 0 for status in StatusJogo}
        for jogo in jogos:
            jogos_por_status[jogo.status] += 1
        return {
            "total_jogos": len(jogos),
            "total_horas_jogadas": sum(jogo.horas_jogadas for jogo in jogos),
            "jogos_por_status": jogos_por_status,
        }

    def _buscar_existente(self, jogo_id: int) -> Jogo:
        jogo = self._repositorio.buscar_por_id(jogo_id)
        if jogo is None:
            raise JogoNaoEncontradoErro
        return jogo

    def _garantir_unicidade(self, titulo: str, plataforma: str, id_jogo_ignorado: int | None = None) -> None:
        for jogo in self._repositorio.listar():
            e_mesmo_jogo = jogo.titulo.casefold() == titulo.casefold() and jogo.plataforma.casefold() == plataforma.casefold()
            if e_mesmo_jogo and jogo.id != id_jogo_ignorado:
                raise JogoDuplicadoErro("Já existe um jogo com este título e plataforma")
