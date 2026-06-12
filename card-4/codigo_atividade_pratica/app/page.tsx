"use client";

import { FC, useState } from "react";
import { useFuzzySearch, useGames } from "@/hooks";
import GameCard from "@/components/GameCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

/**
 * Página inicial - Lista todos os jogos salvos
 * Boa prática: Usar 'use client' para componentes que precisam de interatividade
 */
const Home: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Custom hook para gerenciar lista de jogos
  const { games, mounted, deleteGame, updateGameRating } = useGames();
  const filteredGames = useFuzzySearch(games, searchQuery);

  // Garante que apenas renderiza após montagem no cliente (Hydration fix)
  if (!mounted) {
    return <LoadingState />;
  }

  if (games.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Meus Jogos ({games.length})</h2>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar por nome ou comentário..."
          className="w-full md:w-80 bg-gray-800 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Buscar jogos salvos"
        />
      </div>

      {filteredGames.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-300">
          Nenhum jogo encontrado para &quot;{searchQuery.trim()}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={deleteGame}
              onUpdateRating={updateGameRating}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
