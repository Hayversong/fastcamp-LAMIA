"use client";

import { useState, FC } from "react";
import { useRouter } from "next/navigation";
import GameForm from "@/components/GameForm";
import { addGame } from "@/services/gamesApi";
import type { GameData } from "@/types";

const AddGamePage: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddGame = async (formData: GameData): Promise<void> => {
    setIsLoading(true);
    try {
      addGame(formData);
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
};

export default AddGamePage;
