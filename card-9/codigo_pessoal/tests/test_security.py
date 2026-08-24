from jwt import decode

from core.security import create_access_token
from core.settings import settings


def test_gerar_token_jwt() -> None:
    dados = {'sub': 'test@example.com'}
    token = create_access_token(dados)

    decodificado = decode(
        token,
        settings.secret_key,
        algorithms=[settings.jwt_algorithm],
    )

    assert decodificado['sub'] == dados['sub']
    assert 'exp' in decodificado
