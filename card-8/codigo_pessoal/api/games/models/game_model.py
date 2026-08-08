from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict


class StatusJogo(str, Enum):
    BACKLOG = "backlog"
    PLAYING = "playing"
    COMPLETED = "completed"
    DROPPED = "dropped"


class Jogo(BaseModel):
    """Entidade interna persistida pelo repositório."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    plataforma: str
    genero: str
    status: StatusJogo
    horas_jogadas: float
    nota: float | None = None
    data_compra: date | None = None
