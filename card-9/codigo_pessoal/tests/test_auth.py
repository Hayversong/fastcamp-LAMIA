from fastapi import status
from fastapi.testclient import TestClient


def test_registrar_usuario(cliente: TestClient) -> None:
    resposta = cliente.post(
        '/auth/register',
        json={
            'username': 'novousuario',
            'email': 'novo@example.com',
            'senha': 'senha123',
        },
    )
    assert resposta.status_code == status.HTTP_201_CREATED
    dados = resposta.json()
    assert dados['email'] == 'novo@example.com'
    assert 'senha' not in dados


def test_login_com_credenciais_validas(
    cliente: TestClient,
    usuario: dict[str, object],
) -> None:
    resposta = cliente.post(
        '/auth/token',
        data={
            'username': str(usuario['email']),
            'password': str(usuario['senha_limpa']),
        },
    )
    assert resposta.status_code == status.HTTP_200_OK
    dados = resposta.json()
    assert 'access_token' in dados
    assert dados['token_type'] == 'bearer'


def test_login_com_senha_errada(
    cliente: TestClient,
    usuario: dict[str, object],
) -> None:
    resposta = cliente.post(
        '/auth/token',
        data={
            'username': str(usuario['email']),
            'password': 'senha_errada',
        },
    )
    assert resposta.status_code == status.HTTP_401_UNAUTHORIZED
    assert resposta.json() == {'detail': 'Email ou senha incorretos'}


def test_login_com_email_inexistente_retorna_401(
    cliente: TestClient,
) -> None:
    resposta = cliente.post(
        '/auth/token',
        data={
            'username': 'inexistente@example.com',
            'password': 'senha_qualquer',
        },
    )
    assert resposta.status_code == status.HTTP_401_UNAUTHORIZED
    assert resposta.json() == {'detail': 'Email ou senha incorretos'}


def test_token_invalido_retorna_401(cliente: TestClient) -> None:
    resposta = cliente.get(
        '/api/v1/games/',
        headers={'Authorization': 'Bearer token-invalido'},
    )
    assert resposta.status_code == status.HTTP_401_UNAUTHORIZED
    assert resposta.json()['detail'] == (
        'Não foi possível validar as credenciais'
    )


def test_acesso_sem_token_retorna_401(cliente: TestClient) -> None:
    resposta = cliente.get('/api/v1/games/')
    assert resposta.status_code == status.HTTP_401_UNAUTHORIZED


def test_email_duplicado_retorna_409(
    cliente: TestClient,
    usuario: dict[str, object],
) -> None:
    resposta = cliente.post(
        '/auth/register',
        json={
            'username': 'outro_user',
            'email': usuario['email'],
            'senha': 'outrasenha',
        },
    )
    assert resposta.status_code == status.HTTP_409_CONFLICT


def test_username_duplicado_retorna_409(
    cliente: TestClient,
    usuario: dict[str, object],
) -> None:
    resposta = cliente.post(
        '/auth/register',
        json={
            'username': usuario['username'],
            'email': 'outro@example.com',
            'senha': 'outrasenha',
        },
    )
    assert resposta.status_code == status.HTTP_409_CONFLICT
