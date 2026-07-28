import type { GameMode, RegulationLimit } from "./types";

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  "master-duel": "Master Duel",
  tcg: "TCG",
  ocg: "OCG",
};

export const LIMIT_LABELS: Record<RegulationLimit, string> = {
  0: "Proibida",
  1: "Limitada",
  2: "Semilimitada",
};

export const CARDS_PER_PAGE = 20;
