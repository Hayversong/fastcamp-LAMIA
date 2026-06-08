/**
 * Tipos centralizados para o aplicativo de avaliação de jogos
 *
 * Organização:
 * - game.ts: Tipos de jogos e componentes relacionados
 * - form.ts: Tipos de formulários e componentes
 * - api.ts: Tipos de API, responses e validações
 */

// Re-export de tipos de jogos
export type { SearchedGame, GameData, SavedGame, GameCardProps } from "./game";

// Re-export de tipos de formulários
export type { GameFormInput, GameFormProps } from "./form";

// Re-export de tipos de API
export type { ValidationResult, ApiError, RawgApiResponse } from "./api";
