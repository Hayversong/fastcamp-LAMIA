import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

SQLALCHEMY_TEST_URL = 'sqlite:///./test.db'
os.environ['DATABASE_URL'] = SQLALCHEMY_TEST_URL

from core.database import Base  # noqa: E402
from core.deps import get_db  # noqa: E402
from main import app  # noqa: E402

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={'check_same_thread': False},
)
TestingSessionLocal = sessionmaker(
    bind=engine_test,
    autocommit=False,
    autoflush=False,
)


@pytest.fixture(autouse=True)
def banco_isolado() -> Generator[None, None, None]:
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def cliente(banco_isolado: None) -> Generator[TestClient, None, None]:
    def sobrescrever_db() -> Generator[Session, None, None]:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = sobrescrever_db
    yield TestClient(app)
    app.dependency_overrides.clear()
