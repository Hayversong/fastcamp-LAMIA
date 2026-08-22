from fastapi import FastAPI

from api.games.controllers.game_controller import router as games_router
from api.games.models.game_model import JogoORM  # noqa: F401
from api.users.controllers.user_controller import router as auth_router
from api.users.models.user_model import UsuarioORM  # noqa: F401
from core.database import Base, engine

# Em produção, usar Alembic no lugar desta criação automática de tabelas.
Base.metadata.create_all(bind=engine)

app = FastAPI(title='GameShelf API', version='2.0.0')
app.include_router(auth_router)
app.include_router(games_router)


@app.get('/health', tags=['Health'])
def verificar_saude() -> dict[str, str]:
    return {'status': 'ok'}
