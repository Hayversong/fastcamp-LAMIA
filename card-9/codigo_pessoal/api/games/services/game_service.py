from api.games.models.game_model import JogoORM, StatusJogo
from api.games.repositories.game_repository import RepositorioJogos
from api.games.schemas.game_schema import (
    JogoAtualizacao,
    JogoAtualizacaoProgresso,
    JogoCriacao,
)


class JogoNaoEncontradoErro(Exception):
    pass


class JogoDuplicadoErro(Exception):
    pass


class ServicoJogos:
    def __init__(self, repositorio: RepositorioJogos) -> None:
        self._repositorio = repositorio

    def criar(self, dados: JogoCriacao, user_id: int) -> JogoORM:
        self._garantir_unicidade(dados.titulo, dados.plataforma, user_id)
        return self._repositorio.criar(dados, user_id=user_id)

    def listar(
        self,
        user_id: int,
        status: StatusJogo | None = None,
        plataforma: str | None = None,
    ) -> list[JogoORM]:
        return self._repositorio.listar(
            user_id=user_id,
            status=status,
            plataforma=plataforma,
        )

    def buscar_por_id(self, jogo_id: int, user_id: int) -> JogoORM:
        return self._buscar_existente(jogo_id, user_id)

    def atualizar(
        self,
        jogo_id: int,
        dados: JogoAtualizacao,
        user_id: int,
    ) -> JogoORM:
        jogo = self._buscar_existente(jogo_id, user_id)
        self._garantir_unicidade(
            dados.titulo,
            dados.plataforma,
            user_id,
            id_jogo_ignorado=jogo.id,
        )
        return self._repositorio.atualizar(jogo, dados.model_dump())

    def atualizar_progresso(
        self,
        jogo_id: int,
        dados: JogoAtualizacaoProgresso,
        user_id: int,
    ) -> JogoORM:
        jogo = self._buscar_existente(jogo_id, user_id)
        atualizacoes = dados.model_dump(exclude_unset=True)
        return self._repositorio.atualizar(jogo, atualizacoes)

    def remover(self, jogo_id: int, user_id: int) -> None:
        jogo = self._buscar_existente(jogo_id, user_id)
        self._repositorio.remover(jogo)

    def resumo(
        self,
        user_id: int,
    ) -> dict[str, int | float | dict[StatusJogo, int]]:
        jogos = self._repositorio.listar(user_id=user_id)
        jogos_por_status = {status: 0 for status in StatusJogo}
        for jogo in jogos:
            jogos_por_status[jogo.status] += 1
        return {
            'total_jogos': len(jogos),
            'total_horas_jogadas': sum(jogo.horas_jogadas for jogo in jogos),
            'jogos_por_status': jogos_por_status,
        }

    def _buscar_existente(self, jogo_id: int, user_id: int) -> JogoORM:
        jogo = self._repositorio.buscar_por_id(jogo_id, user_id=user_id)
        if jogo is None:
            raise JogoNaoEncontradoErro
        return jogo

    def _garantir_unicidade(
        self,
        titulo: str,
        plataforma: str,
        user_id: int,
        id_jogo_ignorado: int | None = None,
    ) -> None:
        duplicado = self._repositorio.buscar_duplicado(
            titulo,
            plataforma,
            user_id=user_id,
            ignorar_id=id_jogo_ignorado,
        )
        if duplicado is not None:
            raise JogoDuplicadoErro(
                'Já existe um jogo com este título e plataforma'
            )
