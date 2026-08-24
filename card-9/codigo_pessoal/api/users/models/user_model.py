from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.database import Base, TimestampMixin


class UsuarioORM(Base, TimestampMixin):
    __tablename__ = 'usuarios'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(60),
        unique=True,
        nullable=False,
    )
    email: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        nullable=False,
    )
    senha: Mapped[str] = mapped_column(String(255), nullable=False)

    jogos: Mapped[list] = relationship(
        'JogoORM',
        back_populates='dono',
        lazy='select',
    )
