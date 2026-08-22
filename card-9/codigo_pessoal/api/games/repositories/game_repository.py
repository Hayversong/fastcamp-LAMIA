from sqlalchemy.orm import Session

from api.games.models.game_model import JogoORM, StatusJogo
from api.games.schemas.game_schema import JogoCriacao


class RepositorioJogos:
    def __init__(self, db: Session) -> None:
        self._db = db

    def criar(self, dados: JogoCriacao) -> JogoORM:
        jogo = JogoORM(**dados.model_dump())
        self._db.add(jogo)
        self._db.commit()
        self._db.refresh(jogo)
        return jogo

    def listar(
        self,
        status: StatusJogo | None = None,
        plataforma: str | None = None,
    ) -> list[JogoORM]:
        query = self._db.query(JogoORM)
        if status is not None:
            query = query.filter(JogoORM.status == status)
        if plataforma is not None:
            query = query.filter(JogoORM.plataforma.ilike(plataforma.strip()))
        return query.all()

    def buscar_por_id(self, jogo_id: int) -> JogoORM | None:
        return self._db.query(JogoORM).filter(JogoORM.id == jogo_id).first()

    def atualizar(self, jogo: JogoORM, dados: dict[str, object]) -> JogoORM:
        for campo, valor in dados.items():
            setattr(jogo, campo, valor)
        self._db.commit()
        self._db.refresh(jogo)
        return jogo

    def remover(self, jogo: JogoORM) -> None:
        self._db.delete(jogo)
        self._db.commit()

    def buscar_duplicado(
        self,
        titulo: str,
        plataforma: str,
        ignorar_id: int | None = None,
    ) -> JogoORM | None:
        query = self._db.query(JogoORM).filter(
            JogoORM.titulo.ilike(titulo.strip()),
            JogoORM.plataforma.ilike(plataforma.strip()),
        )
        if ignorar_id is not None:
            query = query.filter(JogoORM.id != ignorar_id)
        return query.first()
