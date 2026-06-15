"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GameDataSchema } from "@/lib/validation";
import { useGames } from "./useGames";
import { useValidation } from "./useValidation";
import type { GameData } from "@/types";

interface UseAddGameResult {
  isLoading: boolean;
  error: string;
  handleSubmit: (formData: GameData) => Promise<void>;
}

export function useAddGame(): UseAddGameResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { addNewGame } = useGames();
  const { validate } = useValidation();

  const handleSubmit = useCallback(
    async (formData: GameData): Promise<void> => {
      setIsLoading(true);
      setError("");

      try {
        const validation = validate(formData, GameDataSchema);

        if (!validation.success || !validation.data) {
          setError(validation.error || "Erro ao validar dados");
          return;
        }

        await addNewGame(validation.data);
        router.push("/");
      } catch (submitError) {
        console.error("Erro ao adicionar jogo:", submitError);
        setError("Erro ao adicionar jogo. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [addNewGame, router, validate],
  );

  return { isLoading, error, handleSubmit };
}
