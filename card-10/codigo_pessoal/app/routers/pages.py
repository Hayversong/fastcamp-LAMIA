from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


router = APIRouter()
STATIC_DIR = Path(__file__).resolve().parents[2] / "static"

# Os assets ficam sob /static; a página principal é entregue em /.
router.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@router.get("/", include_in_schema=False)
async def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")
