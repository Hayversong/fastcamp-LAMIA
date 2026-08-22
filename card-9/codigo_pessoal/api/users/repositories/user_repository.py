from sqlalchemy.orm import Session

from api.users.models.user_model import UsuarioORM


class RepositorioUsuarios:
    def __init__(self, db: Session) -> None:
        self._db = db

    def criar(
        self,
        username: str,
        email: str,
        senha_hash: str,
    ) -> UsuarioORM:
        usuario = UsuarioORM(
            username=username,
            email=email,
            senha=senha_hash,
        )
        self._db.add(usuario)
        self._db.commit()
        self._db.refresh(usuario)
        return usuario

    def buscar_por_email(self, email: str) -> UsuarioORM | None:
        return (
            self._db
            .query(UsuarioORM)
            .filter(UsuarioORM.email == email)
            .first()
        )

    def buscar_por_username(self, username: str) -> UsuarioORM | None:
        return (
            self._db
            .query(UsuarioORM)
            .filter(UsuarioORM.username == username)
            .first()
        )

    def buscar_por_id(self, usuario_id: int) -> UsuarioORM | None:
        return (
            self._db
            .query(UsuarioORM)
            .filter(UsuarioORM.id == usuario_id)
            .first()
        )
