/**
 * Tipos relacionados a Jogos
 */

/**
 * Dados de um jogo retornado pela API RAWG
 */
export interface SearchedGame {
  name: string;
  image: string | null;
  released: string | null;
  rating: number | null;
}

/**
 * Dados completos de um jogo a ser salvo
 */
export interface GameData {
  name: string;
  image: string | null;
  released: string | null;
  rating: number;
  comment: string;
}

/**
 * Dados de um jogo salvo (com metadados)
 */
export interface SavedGame extends GameData {
  id: number;
  createdAt: string;
}

/**
 * Propriedades do componente GameCard
 */
export interface GameCardProps {
  game: SavedGame;
  onDelete: (id: number) => void;
  onUpdateRating: (id: number, rating: number, comment: string) => void;
}
