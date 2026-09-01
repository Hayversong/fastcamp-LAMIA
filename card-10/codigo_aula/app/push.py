from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from .manager import ws_manager

class Message(BaseModel):
    message: str

push_router = APIRouter()
templates = Jinja2Templates(directory='templates')

@push_router.get('/push', response_class=HTMLResponse)
def route(request: Request):
    return templates.TemplateResponse(
        request=request,
        name='push.html',
        context={}
    )

@push_router.post('/push', response_model=Message)
def route_b(request: Request):
    #implementação do websocket
    
    return {'message':'ok'}

@push_router.websocket('/ws/push')
async def push_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.broadcast(data)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@push_router.get('/polling', response_class=HTMLResponse)
def route(request: Request):
    return templates.TemplateResponse(
        request=request,
        name='polling.html',
        context={}
    )
