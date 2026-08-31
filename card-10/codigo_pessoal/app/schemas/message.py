from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field, field_validator


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class MessageType(str, Enum):
    CHAT = "chat"
    SYSTEM = "system"
    WELCOME = "welcome"
    ERROR = "error"


class IncomingMessage(BaseModel):
    user: str = Field(min_length=1, max_length=50)
    content: str = Field(min_length=1, max_length=2_000)
    timestamp: datetime = Field(default_factory=utc_now)

    @field_validator("user", "content")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("o texto não pode ficar vazio")
        return cleaned


class OutgoingMessage(BaseModel):
    type: MessageType
    client_id: str | None = None
    user: str
    content: str
    timestamp: datetime = Field(default_factory=utc_now)
