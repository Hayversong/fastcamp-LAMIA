from fastapi import status
from fastapi.testclient import TestClient

HORAS_ATUALIZADAS = 10
HORAS_PROGREDIDAS = 20


def dados_jogo(**sobrescritas: object) -> dict[str, object]:
    dados: dict[str, object] = {
        "titulo": "Hades",
        "plataforma": "PC",
        "genero": "Roguelike",
        "status": "backlog",
        "horas_jogadas": 0,
        "nota": None,
        "data_compra": "2026-01-15",
    }
    dados.update(sobrescritas)
    return dados


def criar_jogo(
    cliente: TestClient,
    **sobrescritas: object,
) -> dict[str, object]:
    resposta = cliente.post(
        "/api/v1/games/",
        json=dados_jogo(**sobrescritas),
    )
    assert resposta.status_code == status.HTTP_201_CREATED
    return resposta.json()


def test_verificacao_saude(cliente: TestClient) -> None:
    resposta = cliente.get("/health")
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json() == {"status": "ok"}


def test_criar_jogo(cliente: TestClient) -> None:
    jogo = criar_jogo(cliente)
    assert jogo["id"] == 1
    assert jogo["titulo"] == "Hades"


def test_listar_jogos_com_filtros(cliente: TestClient) -> None:
    criar_jogo(cliente, status="playing")
    criar_jogo(
        cliente,
        titulo="Forza Horizon",
        plataforma="Xbox",
        genero="Corrida",
    )
    resposta = cliente.get("/api/v1/games/?status=playing&plataforma=PC")
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()["total"] == 1
    assert resposta.json()["itens"][0]["titulo"] == "Hades"


def test_buscar_jogo_por_id(cliente: TestClient) -> None:
    jogo = criar_jogo(cliente)
    resposta = cliente.get(f"/api/v1/games/{jogo['id']}")
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()["id"] == jogo["id"]


def test_atualizar_jogo(cliente: TestClient) -> None:
    jogo = criar_jogo(cliente)
    resposta = cliente.put(
        f"/api/v1/games/{jogo['id']}",
        json=dados_jogo(
            titulo="Hades II",
            status="playing",
            horas_jogadas=HORAS_ATUALIZADAS,
            nota=9,
        ),
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()["titulo"] == "Hades II"
    assert resposta.json()["horas_jogadas"] == HORAS_ATUALIZADAS


def test_atualizar_progresso(cliente: TestClient) -> None:
    jogo = criar_jogo(cliente)
    resposta = cliente.patch(
        f"/api/v1/games/{jogo['id']}/progress",
        json={"horas_jogadas": HORAS_PROGREDIDAS, "status": "playing"},
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()["horas_jogadas"] == HORAS_PROGREDIDAS


def test_remover_jogo(cliente: TestClient) -> None:
    jogo = criar_jogo(cliente)
    resposta_remocao = cliente.delete(f"/api/v1/games/{jogo['id']}")
    assert resposta_remocao.status_code == status.HTTP_204_NO_CONTENT

    resposta_busca = cliente.get(f"/api/v1/games/{jogo['id']}")
    assert resposta_busca.status_code == status.HTTP_404_NOT_FOUND


def test_jogo_inexistente_retorna_404(cliente: TestClient) -> None:
    resposta = cliente.get("/api/v1/games/999")
    assert resposta.status_code == status.HTTP_404_NOT_FOUND
    assert resposta.json() == {"detail": "Jogo não encontrado"}


def test_rejeita_nota_e_horas_invalidas(cliente: TestClient) -> None:
    resposta_nota = cliente.post("/api/v1/games/", json=dados_jogo(nota=11))
    resposta_horas = cliente.post(
        "/api/v1/games/",
        json=dados_jogo(horas_jogadas=-1),
    )
    assert resposta_nota.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert resposta_horas.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_rejeita_jogo_duplicado(cliente: TestClient) -> None:
    criar_jogo(cliente)
    resposta = cliente.post(
        "/api/v1/games/",
        json=dados_jogo(titulo="hades", plataforma="pc"),
    )
    assert resposta.status_code == status.HTTP_409_CONFLICT


def test_resumo(cliente: TestClient) -> None:
    criar_jogo(cliente, status="playing", horas_jogadas=12)
    criar_jogo(cliente, titulo="Celeste", status="completed", horas_jogadas=8)
    resposta = cliente.get("/api/v1/games/stats/summary")
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json() == {
        "total_jogos": 2,
        "total_horas_jogadas": 20.0,
        "jogos_por_status": {
            "backlog": 0,
            "playing": 1,
            "completed": 1,
            "dropped": 0,
        },
    }
