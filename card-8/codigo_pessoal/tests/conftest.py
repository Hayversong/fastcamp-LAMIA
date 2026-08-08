import pytest
from fastapi.testclient import TestClient

from api.games.controllers.game_controller import reiniciar_repositorio_jogos
from main import app


@pytest.fixture(autouse=True)
def reiniciar_repositorio() -> None:
    reiniciar_repositorio_jogos()
    yield
    reiniciar_repositorio_jogos()


@pytest.fixture
def cliente() -> TestClient:
    return TestClient(app)
