import os
from dataclasses import dataclass


def _read_bool(variable_name: str, default: bool) -> bool:
    value = os.getenv(variable_name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True, slots=True)
class Settings:
    app_name: str = os.getenv("CHAT_APP_NAME", "Mini-chat com FastAPI")
    host: str = os.getenv("CHAT_HOST", "127.0.0.1")
    port: int = int(os.getenv("CHAT_PORT", "8000"))
    echo_messages: bool = _read_bool("CHAT_ECHO_MESSAGES", True)
    announce_connections: bool = _read_bool("CHAT_ANNOUNCE_CONNECTIONS", True)


settings = Settings()
