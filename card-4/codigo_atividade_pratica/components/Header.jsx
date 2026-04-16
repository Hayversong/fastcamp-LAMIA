"use client";

import Link from "next/link";

/**
 * Componente Header com navegação principal da aplicação
 * Componente responsável apenas pela UI de navegação
 */
export default function Header() {
  return (
    <header className="bg-gray-800 shadow-lg">
      <nav className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-500">★ Games Review</h1>

          {/* Menu de navegação principal */}
          <ul className="flex gap-6">
            {/* Link para página inicial */}
            <li>
              <Link
                href="/"
                className="hover:text-blue-500 transition duration-300"
              >
                Início
              </Link>
            </li>

            {/* Link para adicionar novo jogo */}
            <li>
              <Link
                href="/add"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Adicionar Jogo
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
