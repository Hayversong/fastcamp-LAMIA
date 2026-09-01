from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

class Message(BaseModel):
    message: int

dynamic_router = APIRouter()
templates = Jinja2Templates(directory='templates')

@dynamic_router.get('/dinamico', response_class=HTMLResponse)
def route(request: Request):
    return templates.TemplateResponse(
        request=request,
        name='dynamic.html',
        context={}
    )

@dynamic_router.get('/dinamico/dado', response_model=Message)
def route_b(request: Request):
    from random import randint

    return {'message': randint(1,100)}

@dynamic_router.get('/polling', response_class=HTMLResponse)
def route(request: Request):
    return templates.TemplateResponse(
        request=request,
        name='polling.html',
        context={}
    )