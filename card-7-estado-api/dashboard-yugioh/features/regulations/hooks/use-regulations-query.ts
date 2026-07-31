"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentRegulation } from "../services/regulations-api";
import type { GameMode } from "../types";

export const regulationKeys = {
  all: ["regulations"] as const,
  current: (gameMode: GameMode) =>
    [...regulationKeys.all, gameMode, "current"] as const,
};

export function useRegulationsQuery(gameMode: GameMode) {
  return useQuery({
    queryKey: regulationKeys.current(gameMode),
    queryFn: () => getCurrentRegulation(gameMode),
  });
}
