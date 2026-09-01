from fastapi import FastAPI

from app.core.config import settings
from app.routers import pages, websocket


app = FastAPI(title=settings.app_name)
app.include_router(pages.router)
app.include_router(websocket.router)
