"use client";

import { useState, FC } from "react";
import { useRouter } from "next/navigation";
import { useGames, useValidation } from "@/hooks";
import { GameDataSchema } from "@/lib/validation";
import GameForm from "@/components/GameForm";
import type { GameData } from "@/types";

const AddGamePage: FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addNewGame } = useGames();
  const { validate } = useValidation();

  const handleAddGame = async (formData: GameData): Promise<void> => {
    setIsLoading(true);
    try {
      // Validar dados antes de salvar
      const validation = validate(formData, GameDataSchema);

      if (!validation.success || !validation.data) {
        alert(validation.error || "Erro ao validar dados");
        setIsLoading(false);
        return;
      }

      await addNewGame(validation.data);
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
