from fastapi import FastAPI

from api.games.controllers.game_controller import router as games_router
from api.games.models.game_model import JogoORM  # noqa: F401
from core.database import Base, engine

# Em produção, usar Alembic no lugar desta criação automática de tabelas.
Base.metadata.create_all(bind=engine)

app = FastAPI(title='GameShelf API', version='1.0.0')
app.include_router(games_router)


@app.get('/health', tags=['Health'])
def verificar_saude() -> dict[str, str]:
    return {'status': 'ok'}
