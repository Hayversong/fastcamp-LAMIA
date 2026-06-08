"use client";

import { useState, useEffect, FC } from "react";
import { validateData, GameFormInputSchema } from "@/lib/validation";
import GameCard from "@/components/GameCard";
import EmptyState from "@/components/EmptyState";
import type { SavedGame } from "@/types";

/**
 * Página inicial - Lista todos os jogos salvos
 * Boa prática: Usar 'use client' para componentes que precisam de interatividade
 */
const Home: FC = () => {
  // Estados para gerenciar lista de jogos e carregamento
  const [games, setGames] = useState<SavedGame[]>([]);
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
  const handleDeleteGame = (id: number): void => {
    const updatedGames = games.filter((game) => game.id !== id);
    setGames(updatedGames);
    localStorage.setItem("gamesReview", JSON.stringify(updatedGames));
  };

  /**
   * Atualiza a avaliação de um jogo
   * Valida dados antes de atualizar
   * Boa prática: Manter consistência entre estado e persistência
   */
  const handleUpdateRating = (
    id: number,
    newRating: number,
    newComment: string,
  ): void => {
    const game = games.find((g) => g.id === id);
    if (!game) {
      console.error("Jogo não encontrado");
      return;
    }

    // Validar dados antes de salvar
    const validation = validateData(
      {
        gameName: game.name,
        rating: newRating,
        comment: newComment,
      },
      GameFormInputSchema,
    );

    if (!validation.success) {
      console.error("Erro ao validar dados:", validation.error);
      alert(validation.error || "Erro ao validar dados");
      return;
    }

    const updatedGames = games.map((g) =>
      g.id === id ? { ...g, rating: newRating, comment: newComment } : g,
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
};

export default Home;
