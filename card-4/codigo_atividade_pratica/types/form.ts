/**
 * Tipos relacionados a Formulários
 */

import type { GameData, GameFormInput } from "@/lib/validation";

export type { GameFormInput };

/**
 * Propriedades do componente GameForm
 */
export interface GameFormProps {
  onSubmit: (formData: GameData) => void;
  isLoading: boolean;
  submitError?: string;
}
