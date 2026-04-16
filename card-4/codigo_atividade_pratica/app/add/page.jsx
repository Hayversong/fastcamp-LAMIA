"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GameForm from "@/components/GameForm";

/**
 * Página para adicionar um novo jogo
 * Boa prática: Separar páginas de formulário em rotas próprias
 */
export default function AddGamePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Adiciona um novo jogo ao localStorage
   * Boa prática: Validar e tratar erros antes de persistir
   */
  const handleAddGame = async (formData) => {
    setIsLoading(true);
    try {
      // Obtém os jogos salvos
      const savedGames = localStorage.getItem("gamesReview");
      const games = savedGames ? JSON.parse(savedGames) : [];

      // Cria novo jogo com ID único baseado em timestamp
      const newGame = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Adiciona o novo jogo à lista
      games.push(newGame);
      localStorage.setItem("gamesReview", JSON.stringify(games));

      // Redireciona para a página inicial
      router.push("/");
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
      alert("Erro ao adicionar jogo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Adicionar Novo Jogo</h2>
      <GameForm onSubmit={handleAddGame} isLoading={isLoading} />
    </div>
  );
}
