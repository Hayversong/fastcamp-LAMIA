"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addGame, getGames, removeGame, updateGame } from "@/services/gamesApi";
import type { GameData, SavedGame } from "@/types";

export interface GamesContextValue {
  games: SavedGame[];
  mounted: boolean;
  addNewGame: (formData: GameData) => Promise<SavedGame>;
  deleteGame: (id: number) => Promise<void>;
  updateGameRating: (
    id: number,
    newRating: number,
    newComment: string,
  ) => Promise<SavedGame | null>;
}

const GamesContext = createContext<GamesContextValue | undefined>(undefined);
const GAMES_QUERY_KEY = ["games"];

interface GamesProviderProps {
  children: ReactNode;
}

export function GamesProvider({ children }: GamesProviderProps) {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: games = [], isFetched } = useQuery({
    queryKey: GAMES_QUERY_KEY,
    queryFn: getGames,
    enabled: mounted,
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: async (formData: GameData) => addGame(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => removeGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      rating,
      comment,
    }: {
      id: number;
      rating: number;
      comment: string;
    }) => updateGame(id, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAMES_QUERY_KEY });
    },
  });

  const addNewGame = async (formData: GameData): Promise<SavedGame> => {
    const result = await addMutation.mutateAsync(formData);
    return result;
  };

  const deleteGame = async (id: number): Promise<void> => {
    await deleteMutation.mutateAsync(id);
  };

  const updateGameRating = async (
    id: number,
    newRating: number,
    newComment: string,
  ): Promise<SavedGame | null> => {
    const result = await updateMutation.mutateAsync({
      id,
      rating: newRating,
      comment: newComment,
    });
    return result;
  };

  const value = useMemo(
    () => ({
      games,
      mounted: mounted && isFetched,
      addNewGame,
      deleteGame,
      updateGameRating,
    }),
    [games, mounted, isFetched],
  );

  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
}

export function useGamesContext(): GamesContextValue {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error("useGamesContext must be used within GamesProvider");
  }
  return context;
}
