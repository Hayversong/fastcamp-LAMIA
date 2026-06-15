import type { GameData, GameFormInput } from "@/lib/validation";

export type { GameFormInput };

export interface GameFormProps {
  onSubmit: (formData: GameData) => void;
  isLoading: boolean;
  submitError?: string;
}
