import os
from collections.abc import Generator

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

SQLALCHEMY_TEST_URL = 'sqlite:///./test.db'
os.environ['DATABASE_URL'] = SQLALCHEMY_TEST_URL

from core.database import Base  # noqa: E402
from core.deps import get_db  # noqa: E402
from main import app  # noqa: E402

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={'check_same_thread': False},
)
TestingSessionLocal = sessionmaker(
    bind=engine_test,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(autouse=True)
def banco_isolado() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def cliente(banco_isolado: None) -> Generator[TestClient, None, None]:
    def sobrescrever_db() -> Generator[Session, None, None]:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = sobrescrever_db
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def usuario(cliente: TestClient) -> dict[str, object]:
    senha = 'senhateste'
    resposta = cliente.post(
        '/auth/register',
        json={
            'username': 'testuser',
            'email': 'test@example.com',
            'senha': senha,
        },
    )
    assert resposta.status_code == status.HTTP_201_CREATED
    dados = resposta.json()
    dados['senha_limpa'] = senha
    return dados


@pytest.fixture
def token(cliente: TestClient, usuario: dict[str, object]) -> str:
    resposta = cliente.post(
        '/auth/token',
        data={
            'username': str(usuario['email']),
            'password': str(usuario['senha_limpa']),
        },
    )
    assert resposta.status_code == status.HTTP_200_OK
    return resposta.json()['access_token']


@pytest.fixture
def headers_auth(token: str) -> dict[str, str]:
    return {'Authorization': f'Bearer {token}'}
