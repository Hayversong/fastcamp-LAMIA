from fastapi import FastAPI

from api.games.controllers.game_controller import router as games_router
from api.users.controllers.user_controller import router as auth_router

app = FastAPI(title='GameShelf API', version='2.0.0')
app.include_router(auth_router)
app.include_router(games_router)


@app.get('/health', tags=['Health'])
def verificar_saude() -> dict[str, str]:
    return {'status': 'ok'}
