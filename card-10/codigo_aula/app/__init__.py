from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from .static import static_router
from .dynamic import dynamic_router
app = FastAPI()

app.mount(
    '/static',
    StaticFiles(directory='static'),
    name='static'
)

app.include_router(static_router)
app.include_router(dynamic_router)
