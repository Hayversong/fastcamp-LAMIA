import asyncio
from uuid import uuid4

from fastapi import WebSocket

from app.schemas.message import OutgoingMessage


class ConnectionManager:
    """Mantém o ciclo de vida e a entrega das conexões WebSocket.

    Separar esta responsabilidade da rota mantém o endpoint focado no protocolo
    do chat. No futuro, um serviço de LLM poderá reutilizar send_personal_message
    para enviar vários chunks/tokens ao mesmo cliente sem conhecer detalhes de
    conexão, salas ou broadcast.
    """

    def __init__(self) -> None:
        self.active_connections: dict[str, WebSocket] = {}
        self._users: dict[str, str] = {}
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, requested_user: str) -> str:
        await websocket.accept()
        client_id = uuid4().hex
        user = requested_user.strip()[:50] or f"Visitante-{client_id[:6]}"
        async with self._lock:
            self.active_connections[client_id] = websocket
            self._users[client_id] = user
        return client_id

    async def disconnect(self, client_id: str) -> str | None:
        async with self._lock:
            self.active_connections.pop(client_id, None)
            return self._users.pop(client_id, None)

    def get_user(self, client_id: str) -> str:
        return self._users[client_id]

    async def send_personal_message(
        self, message: OutgoingMessage, client_id: str
    ) -> None:
        websocket = self.active_connections.get(client_id)
        if websocket is not None:
            await websocket.send_text(message.model_dump_json())

    async def broadcast(
        self,
        message: OutgoingMessage,
        exclude_client_id: str | None = None,
    ) -> None:
        # Copiamos a coleção antes dos awaits: clientes podem desconectar enquanto
        # uma entrega está em andamento e não devemos manter o lock durante I/O.
        async with self._lock:
            recipients = list(self.active_connections.items())

        failed_clients: list[str] = []
        payload = message.model_dump_json()
        for client_id, websocket in recipients:
            if client_id == exclude_client_id:
                continue
            try:
                await websocket.send_text(payload)
            except RuntimeError:
                failed_clients.append(client_id)

        for client_id in failed_clients:
            await self.disconnect(client_id)
