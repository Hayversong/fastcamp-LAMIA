from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api.users.repositories.user_repository import RepositorioUsuarios
from api.users.schemas.user_schema import (
    TokenResposta,
    UsuarioCriacao,
    UsuarioResposta,
)
from api.users.services.user_service import (
    CredenciaisInvalidasErro,
    EmailJaExisteErro,
    ServicoUsuarios,
    UsernameJaExisteErro,
)
from core.deps import get_db
from core.security import create_access_token

router = APIRouter(prefix='/auth', tags=['Autenticação'])


def obter_servico_usuarios(
    db: Session = Depends(get_db),
) -> ServicoUsuarios:
    return ServicoUsuarios(RepositorioUsuarios(db))


@router.post(
    '/register',
    response_model=UsuarioResposta,
    status_code=status.HTTP_201_CREATED,
)
def registrar_usuario(
    dados: UsuarioCriacao,
    servico: ServicoUsuarios = Depends(obter_servico_usuarios),
) -> UsuarioResposta:
    try:
        return servico.criar(
            username=dados.username,
            email=str(dados.email),
            senha=dados.senha,
        )
    except EmailJaExisteErro as erro:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(erro),
        ) from erro
    except UsernameJaExisteErro as erro:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(erro),
        ) from erro


@router.post('/token', response_model=TokenResposta)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    servico: ServicoUsuarios = Depends(obter_servico_usuarios),
) -> TokenResposta:
    try:
        usuario = servico.autenticar(
            email=form_data.username,
            senha=form_data.password,
        )
    except CredenciaisInvalidasErro as erro:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(erro),
            headers={'WWW-Authenticate': 'Bearer'},
        ) from erro

    access_token = create_access_token(data={'sub': usuario.email})
    return TokenResposta(access_token=access_token)
