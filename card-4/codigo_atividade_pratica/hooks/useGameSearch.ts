import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchGame } from "@/services/gamesApi";
import type { SearchedGame } from "@/types";

export function useGameSearch() {
  const queryClient = useQueryClient();
  const [gameName, setGameName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [manualError, setManualError] = useState("");

  const {
    data: searchedGame = null,
    isFetching: isSearching,
    error: queryError,
  } = useQuery<SearchedGame | null>({
    queryKey: ["game-search", gameName],
    queryFn: () => searchGame(gameName),
    enabled: enabled && gameName.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const error =
    manualError ||
    (queryError instanceof Error
      ? `Erro ao buscar jogo: ${queryError.message}`
      : enabled && !isSearching && searchedGame === null
        ? "Jogo não encontrado"
        : "");

  const search = useCallback(
    async (name: string): Promise<SearchedGame | null> => {
      const trimmed = name.trim();

      if (!trimmed) {
        setManualError("Digite o nome do jogo");
        setEnabled(false);
        setGameName("");
        return null;
      }

      setManualError("");
      setGameName(trimmed);
      setEnabled(true);

      try {
        return await queryClient.fetchQuery({
          queryKey: ["game-search", trimmed],
          queryFn: () => searchGame(trimmed),
          staleTime: 1000 * 60 * 5,
        });
      } catch (fetchError) {
        setManualError(
          fetchError instanceof Error
            ? `Erro ao buscar jogo: ${fetchError.message}`
            : "Erro ao buscar jogo",
        );
        return null;
      }
    },
    [queryClient],
  );

  const clearSearch = useCallback(() => {
    setEnabled(false);
    setGameName("");
    setManualError("");
  }, []);

  return { searchedGame, isSearching, error, search, clearSearch };
}
