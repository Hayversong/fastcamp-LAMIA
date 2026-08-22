from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api.users.models.user_model import UsuarioORM
from api.users.repositories.user_repository import RepositorioUsuarios
from api.users.schemas.user_schema import (
    TokenResposta,
    UsuarioCriacao,
    UsuarioResposta,
)
from api.users.services.user_service import (
    EmailJaExisteErro,
    ServicoUsuarios,
    UsernameJaExisteErro,
)
from core.deps import get_db
from core.security import create_access_token, verify_password

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
    db: Session = Depends(get_db),
) -> TokenResposta:
    usuario = (
        db
        .query(UsuarioORM)
        .filter(UsuarioORM.email == form_data.username)
        .first()
    )

    if usuario is None or not verify_password(
        form_data.password,
        usuario.senha,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Email ou senha incorretos',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    access_token = create_access_token(data={'sub': usuario.email})
    return TokenResposta(access_token=access_token)
