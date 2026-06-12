/**
 * Tipos relacionados a Jogos
 */

import type { GameData, SavedGame, SearchedGame } from "@/lib/validation";

export type { GameData, SavedGame, SearchedGame };

/**
 * Propriedades do componente GameCard
 */
export interface GameCardProps {
  game: SavedGame;
  onDelete: (id: number) => void;
  onUpdateRating: (id: number, rating: number, comment: string) => void;
}
