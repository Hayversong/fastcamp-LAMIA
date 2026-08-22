from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from api.games.models.game_model import StatusJogo
from api.games.repositories.game_repository import RepositorioJogos
from api.games.schemas.game_schema import (
    EstatisticasJogosResposta,
    JogoAtualizacao,
    JogoAtualizacaoProgresso,
    JogoCriacao,
    JogoResposta,
    ListaJogosResposta,
)
from api.games.services.game_service import (
    JogoDuplicadoErro,
    JogoNaoEncontradoErro,
    ServicoJogos,
)
from api.users.models.user_model import UsuarioORM
from core.deps import get_db
from core.security import get_current_user

router = APIRouter(prefix='/api/v1/games', tags=['Jogos'])


def obter_servico_jogos(db: Session = Depends(get_db)) -> ServicoJogos:
    """Fábrica de injeção de dependência do serviço de jogos."""
    return ServicoJogos(RepositorioJogos(db))


def _converter_erro_http(erro: Exception) -> None:
    if isinstance(erro, JogoNaoEncontradoErro):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Jogo não encontrado',
        ) from erro
    if isinstance(erro, JogoDuplicadoErro):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(erro),
        ) from erro
    raise erro


@router.post(
    '/',
    response_model=JogoResposta,
    status_code=status.HTTP_201_CREATED,
)
def criar_jogo(
    dados: JogoCriacao,
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> JogoResposta:
    try:
        return servico.criar(dados, user_id=current_user.id)
    except JogoDuplicadoErro as erro:
        _converter_erro_http(erro)


@router.get('/', response_model=ListaJogosResposta)
def listar_jogos(
    filtro_status: StatusJogo | None = Query(default=None, alias='status'),
    plataforma: str | None = Query(default=None),
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> ListaJogosResposta:
    jogos = servico.listar(
        user_id=current_user.id,
        status=filtro_status,
        plataforma=plataforma,
    )
    return ListaJogosResposta(itens=jogos, total=len(jogos))


@router.get('/stats/summary', response_model=EstatisticasJogosResposta)
def obter_resumo(
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> EstatisticasJogosResposta:
    return EstatisticasJogosResposta(**servico.resumo(user_id=current_user.id))


@router.get('/{jogo_id}', response_model=JogoResposta)
def buscar_jogo(
    jogo_id: int,
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> JogoResposta:
    try:
        return servico.buscar_por_id(jogo_id, user_id=current_user.id)
    except JogoNaoEncontradoErro as erro:
        _converter_erro_http(erro)


@router.put('/{jogo_id}', response_model=JogoResposta)
def atualizar_jogo(
    jogo_id: int,
    dados: JogoAtualizacao,
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> JogoResposta:
    try:
        return servico.atualizar(
            jogo_id,
            dados,
            user_id=current_user.id,
        )
    except (JogoNaoEncontradoErro, JogoDuplicadoErro) as erro:
        _converter_erro_http(erro)


@router.patch('/{jogo_id}/progress', response_model=JogoResposta)
def atualizar_progresso_jogo(
    jogo_id: int,
    dados: JogoAtualizacaoProgresso,
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> JogoResposta:
    try:
        return servico.atualizar_progresso(
            jogo_id,
            dados,
            user_id=current_user.id,
        )
    except JogoNaoEncontradoErro as erro:
        _converter_erro_http(erro)


@router.delete('/{jogo_id}', status_code=status.HTTP_204_NO_CONTENT)
def remover_jogo(
    jogo_id: int,
    servico: ServicoJogos = Depends(obter_servico_jogos),
    current_user: UsuarioORM = Depends(get_current_user),
) -> Response:
    try:
        servico.remover(jogo_id, user_id=current_user.id)
    except JogoNaoEncontradoErro as erro:
        _converter_erro_http(erro)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
