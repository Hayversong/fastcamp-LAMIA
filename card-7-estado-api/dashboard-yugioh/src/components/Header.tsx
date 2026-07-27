import { useUserStore } from "../data/states/user";

export function Header() {
  const user = useUserStore((state) => state.user);

  return (
    <header className="header">
      <div>
        <strong className="header__brand">Yu-Gi-Oh! Dashboard</strong>

        <span className="header__subtitle">Master Duel Regulation</span>
      </div>

      <div className="header__user">
        {user ? (
          <>
            <span>Olá, {user.name}</span>
            <small>{user.email}</small>
          </>
        ) : (
          <span>Usuário não conectado</span>
        )}
      </div>
    </header>
  );
}
