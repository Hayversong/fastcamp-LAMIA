import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchGame } from "@/services/gamesApi";
import type { SearchedGame } from "@/types";

const GAME_SEARCH_QUERY_KEY = "game-search";
const GAME_SEARCH_STALE_TIME = 1000 * 60 * 5;
const GAME_NOT_FOUND_MESSAGE = "Jogo não encontrado.";

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
    queryKey: [GAME_SEARCH_QUERY_KEY, gameName],
    queryFn: () => searchGame(gameName),
    enabled: enabled && gameName.length > 0,
    staleTime: GAME_SEARCH_STALE_TIME,
    retry: 1,
  });

  const error =
    manualError ||
    (queryError instanceof Error
      ? `Erro ao buscar jogo: ${queryError.message}`
      : enabled && !isSearching && searchedGame === null
        ? GAME_NOT_FOUND_MESSAGE
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
        const foundGame = await queryClient.fetchQuery({
          queryKey: [GAME_SEARCH_QUERY_KEY, trimmed],
          queryFn: () => searchGame(trimmed),
          staleTime: GAME_SEARCH_STALE_TIME,
        });

        if (foundGame === null) {
          setManualError(GAME_NOT_FOUND_MESSAGE);
        }

        return foundGame;
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
