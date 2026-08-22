from datetime import datetime, timedelta
from http import HTTPStatus
from typing import TYPE_CHECKING
from zoneinfo import ZoneInfo

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError, decode, encode
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from core.deps import get_db
from core.settings import settings

if TYPE_CHECKING:
    from api.users.models.user_model import UsuarioORM

pwd_context = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/token')


def get_password_hash(senha: str) -> str:
    return pwd_context.hash(senha)


def verify_password(senha_plana: str, senha_hash: str) -> bool:
    return pwd_context.verify(senha_plana, senha_hash)


def create_access_token(data: dict[str, object]) -> str:
    to_encode = data.copy()
    expire = datetime.now(tz=ZoneInfo('UTC')) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    to_encode.update({'exp': expire})
    return encode(
        to_encode,
        settings.secret_key,
        algorithm=settings.jwt_algorithm,
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> 'UsuarioORM':
    from api.users.models.user_model import UsuarioORM  # noqa: PLC0415

    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail='Não foi possível validar as credenciais',
        headers={'WWW-Authenticate': 'Bearer'},
    )

    try:
        payload = decode(
            token,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        subject_email = payload.get('sub')
        if not isinstance(subject_email, str) or not subject_email:
            raise credentials_exception
    except InvalidTokenError as erro:
        raise credentials_exception from erro

    usuario = (
        db.query(UsuarioORM).filter(UsuarioORM.email == subject_email).first()
    )
    if usuario is None:
        raise credentials_exception

    return usuario
