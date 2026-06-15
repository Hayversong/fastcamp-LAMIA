import type { GameData, SavedGame, SearchedGame } from "@/lib/validation";

export type { GameData, SavedGame, SearchedGame };

export interface GameCardProps {
  game: SavedGame;
  onDelete: (id: number) => void;
  onUpdateRating: (id: number, rating: number, comment: string) => void;
}
