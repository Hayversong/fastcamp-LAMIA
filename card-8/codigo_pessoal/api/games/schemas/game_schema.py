from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator

from api.games.models.game_model import StatusJogo


class JogoBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=120, examples=["The Witcher 3"])
    plataforma: str = Field(..., min_length=1, examples=["PC"])
    genero: str = Field(..., min_length=1, examples=["RPG"])
    status: StatusJogo = Field(default=StatusJogo.BACKLOG, examples=["backlog"])
    horas_jogadas: float = Field(default=0, ge=0, examples=[12.5])
    nota: float | None = Field(default=None, ge=0, le=10, examples=[9.5])
    data_compra: date | None = Field(default=None, examples=["2026-01-15"])

    @field_validator("titulo", "plataforma", "genero")
    @classmethod
    def rejeitar_texto_vazio(cls, valor: str) -> str:
        valor = valor.strip()
        if not valor:
            raise ValueError("O campo não pode estar vazio")
        return valor


class JogoCriacao(JogoBase):
    pass


class JogoAtualizacao(JogoBase):
    pass


class JogoAtualizacaoProgresso(BaseModel):
    status: StatusJogo | None = Field(default=None, examples=["playing"])
    horas_jogadas: float | None = Field(default=None, ge=0, examples=[24])
    nota: float | None = Field(default=None, ge=0, le=10, examples=[8])


class JogoResposta(JogoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ListaJogosResposta(BaseModel):
    itens: list[JogoResposta]
    total: int


class EstatisticasJogosResposta(BaseModel):
    total_jogos: int
    total_horas_jogadas: float
    jogos_por_status: dict[StatusJogo, int]
