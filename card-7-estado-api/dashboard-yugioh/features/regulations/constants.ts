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

export function getLimitLabel(limit: number): string {
  switch (limit) {
    case 0:
      return LIMIT_LABELS[0];
    case 1:
      return LIMIT_LABELS[1];
    case 2:
      return LIMIT_LABELS[2];
    default:
      return "Status desconhecido";
  }
}

export const CARDS_PER_PAGE = 20;
