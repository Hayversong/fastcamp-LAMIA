/**
 * Tipos relacionados a Formulários
 */

import type { GameData } from "./game";

/**
 * Dados do formulário de entrada
 */
export interface GameFormInput {
  gameName: string;
  rating: number;
  comment: string;
}

/**
 * Propriedades do componente GameForm
 */
export interface GameFormProps {
  onSubmit: (formData: GameData) => void;
  isLoading: boolean;
}
