from fastapi.testclient import TestClient

from app.main import app


def test_home_page_is_served() -> None:
    with TestClient(app) as client:
        response = client.get("/")

    assert response.status_code == 200
    assert "Mini-chat em tempo real" in response.text
    assert "Entrar no chat" in response.text


def test_websocket_identifies_and_broadcasts_to_two_clients() -> None:
    with TestClient(app) as client:
        with client.websocket_connect("/ws?user=Ana") as first:
            first_welcome = first.receive_json()
            assert first_welcome["type"] == "welcome"
            assert first_welcome["client_id"]

            with client.websocket_connect("/ws?user=Beto") as second:
                second_welcome = second.receive_json()
                assert second_welcome["type"] == "welcome"
                assert first.receive_json()["type"] == "system"

                first.send_json({"user": "Nome adulterado", "content": "Olá!"})
                first_echo = first.receive_json()
                second_copy = second.receive_json()

                assert first_echo["type"] == "chat"
                assert first_echo["user"] == "Ana"
                assert first_echo["content"] == "Olá!"
                assert second_copy == first_echo
