from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.message import IncomingMessage, MessageType, OutgoingMessage
from app.services.connection_manager import ConnectionManager


router = APIRouter()
manager = ConnectionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    requested_user = websocket.query_params.get("user", "Visitante")
    client_id = await manager.connect(websocket, requested_user)
    user = manager.get_user(client_id)

    await manager.send_personal_message(
        OutgoingMessage(
            type=MessageType.WELCOME,
            client_id=client_id,
            user="Servidor",
            content=f"Conectado como {user}.",
        ),
        client_id,
    )

    if settings.announce_connections:
        await manager.broadcast(
            OutgoingMessage(
                type=MessageType.SYSTEM,
                client_id=client_id,
                user="Servidor",
                content=f"{user} entrou no chat.",
            ),
            exclude_client_id=client_id,
        )

    try:
        while True:
            raw_message = await websocket.receive_text()
            try:
                incoming = IncomingMessage.model_validate_json(raw_message)
            except ValidationError:
                await manager.send_personal_message(
                    OutgoingMessage(
                        type=MessageType.ERROR,
                        client_id=client_id,
                        user="Servidor",
                        content="Mensagem inválida. Envie user e content como texto.",
                    ),
                    client_id,
                )
                continue

            # O nome registrado na conexão é a fonte confiável. Isso evita que um
            # cliente se passe por outro alterando apenas o JSON no navegador.
            message = OutgoingMessage(
                type=MessageType.CHAT,
                client_id=client_id,
                user=user,
                content=incoming.content,
                timestamp=incoming.timestamp,
            )
            await manager.broadcast(
                message,
                exclude_client_id=None if settings.echo_messages else client_id,
            )
    except WebSocketDisconnect:
        disconnected_user = await manager.disconnect(client_id)
        if settings.announce_connections and disconnected_user:
            await manager.broadcast(
                OutgoingMessage(
                    type=MessageType.SYSTEM,
                    client_id=client_id,
                    user="Servidor",
                    content=f"{disconnected_user} saiu do chat.",
                )
            )
