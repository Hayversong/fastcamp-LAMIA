from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

static_router = APIRouter()
templates = Jinja2Templates(directory='templates')

@static_router.get('/estatico', response_class=HTMLResponse)
def route(request: Request):
    return templates.TemplateResponse(
        request=request,
        name='static.html',
        context={}
    )
