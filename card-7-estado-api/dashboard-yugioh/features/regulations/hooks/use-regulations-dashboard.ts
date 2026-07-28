"use client";

import { useState } from "react";
import { useRegulationFilters } from "./use-regulation-filters";
import { useRegulationsQuery } from "./use-regulations-query";
import type { GameMode, RegulationCard } from "../types";

const EMPTY_CARDS: RegulationCard[] = [];

export function useRegulationsDashboard() {
  const [gameMode, setGameModeState] = useState<GameMode>("master-duel");
  const query = useRegulationsQuery(gameMode);
  const filters = useRegulationFilters(query.data?.cards ?? EMPTY_CARDS);

  function setGameMode(value: GameMode) {
    setGameModeState(value);
    filters.resetFilters();
  }

  return {
    gameMode,
    setGameMode,
    query,
    filters,
  };
}
