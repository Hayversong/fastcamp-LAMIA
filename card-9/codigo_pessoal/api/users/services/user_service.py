from api.users.models.user_model import UsuarioORM
from api.users.repositories.user_repository import RepositorioUsuarios
from core.security import get_password_hash, verify_password


class EmailJaExisteErro(Exception):
    pass


class UsernameJaExisteErro(Exception):
    pass


class CredenciaisInvalidasErro(Exception):
    pass


class ServicoUsuarios:
    def __init__(self, repositorio: RepositorioUsuarios) -> None:
        self._repositorio = repositorio

    def criar(
        self,
        username: str,
        email: str,
        senha: str,
    ) -> UsuarioORM:
        if self._repositorio.buscar_por_email(email):
            raise EmailJaExisteErro('Email já cadastrado')
        if self._repositorio.buscar_por_username(username):
            raise UsernameJaExisteErro('Username já cadastrado')

        senha_hash = get_password_hash(senha)
        return self._repositorio.criar(
            username=username,
            email=email,
            senha_hash=senha_hash,
        )

    def autenticar(self, email: str, senha: str) -> UsuarioORM:
        usuario = self._repositorio.buscar_por_email(email)
        if usuario is None or not verify_password(senha, usuario.senha):
            raise CredenciaisInvalidasErro('Email ou senha incorretos')
        return usuario
