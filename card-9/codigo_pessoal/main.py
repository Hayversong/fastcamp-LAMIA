from fastapi import FastAPI

from api.games.controllers.game_controller import router as games_router

app = FastAPI(title="GameShelf API", version="1.0.0")
app.include_router(games_router)


@app.get("/health", tags=["Health"])
def verificar_saude() -> dict[str, str]:
    return {"status": "ok"}
