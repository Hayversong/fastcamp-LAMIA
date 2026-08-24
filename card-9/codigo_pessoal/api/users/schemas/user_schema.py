from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UsuarioCriacao(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=60,
        examples=['hayverson'],
    )
    email: EmailStr = Field(..., examples=['hayverson@email.com'])
    senha: str = Field(..., min_length=6, examples=['senha_segura'])


class UsuarioResposta(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str


class TokenResposta(BaseModel):
    access_token: str
    token_type: str = 'bearer'
