from sqlalchemy import Column, DateTime, create_engine, func
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from core.settings import settings

engine = create_engine(settings.database_url, echo=False)
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


class TimestampMixin:
    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
