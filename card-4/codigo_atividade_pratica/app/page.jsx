"use client";

import { useState, useEffect } from "react";
import GameCard from "@/components/GameCard";
import EmptyState from "@/components/EmptyState";

/**
 * Página inicial - Lista todos os jogos salvos
 * Boa prática: Usar 'use client' para componentes que precisam de interatividade
 */
export default function Home() {
  // Estados para gerenciar lista de jogos e carregamento
  const [games, setGames] = useState([]);
  const [mounted, setMounted] = useState(false);

  /**
   * Carrega os jogos do localStorage ao montar o componente
   * Boa prática: useEffect para efeitos colaterais (I/O, storage)
   */
  useEffect(() => {
    try {
      const savedGames = localStorage.getItem("gamesReview");
      if (savedGames) {
        setGames(JSON.parse(savedGames));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error);
    } finally {
      setMounted(true);
    }
  }, []);

  /**
   * Remove um jogo da lista
   * Boa prática: Atualizar estado imutavelmente
   */
  const handleDeleteGame = (id) => {
    const updatedGames = games.filter((game) => game.id !== id);
    setGames(updatedGames);
    localStorage.setItem("gamesReview", JSON.stringify(updatedGames));
  };

  /**
   * Atualiza a avaliação de um jogo
   * Boa prática: Manter consistência entre estado e persistência
   */
  const handleUpdateRating = (id, newRating, newComment) => {
    const updatedGames = games.map((game) =>
      game.id === id
        ? { ...game, rating: newRating, comment: newComment }
        : game,
    );
    setGames(updatedGames);
    localStorage.setItem("gamesReview", JSON.stringify(updatedGames));
  };

  // Garante que apenas renderiza após montagem no cliente (Hydration fix)
  if (!mounted) {
    return <EmptyState />;
  }

  if (games.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Meus Jogos ({games.length})</h2>

      {/* Grid responsivo de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onDelete={handleDeleteGame}
            onUpdateRating={handleUpdateRating}
          />
        ))}
      </div>
    </div>
  );
}
