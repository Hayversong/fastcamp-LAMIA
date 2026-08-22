from datetime import date
from enum import Enum as PythonEnum
from typing import TYPE_CHECKING

from sqlalchemy import Date, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base, TimestampMixin

if TYPE_CHECKING:
    from api.users.models.user_model import UsuarioORM


class StatusJogo(str, PythonEnum):
    BACKLOG = 'backlog'
    PLAYING = 'playing'
    COMPLETED = 'completed'
    DROPPED = 'dropped'


class JogoORM(Base, TimestampMixin):
    __tablename__ = 'jogos'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(120), nullable=False)
    plataforma: Mapped[str] = mapped_column(String(60), nullable=False)
    genero: Mapped[str] = mapped_column(String(60), nullable=False)
    status: Mapped[StatusJogo] = mapped_column(
        Enum(StatusJogo),
        default=StatusJogo.BACKLOG,
        nullable=False,
    )
    horas_jogadas: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    nota: Mapped[float | None] = mapped_column(Float, nullable=True)
    data_compra: Mapped[date | None] = mapped_column(Date, nullable=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey('usuarios.id', ondelete='CASCADE'),
        nullable=False,
    )
    dono: Mapped['UsuarioORM'] = relationship(
        'UsuarioORM',
        back_populates='jogos',
    )
