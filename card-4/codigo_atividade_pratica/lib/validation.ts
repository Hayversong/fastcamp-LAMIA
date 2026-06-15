import { z } from "zod";
import type { ValidationResult } from "@/types/api";

export const SearchedGameSchema = z.object({
  name: z.string().min(1, "Nome do jogo é obrigatório"),
  image: z.string().nullable().default(null),
  released: z.string().nullable().default(null),
  rating: z.number().nullable().default(null),
});

export type SearchedGame = z.infer<typeof SearchedGameSchema>;

export const GameFormInputSchema = z.object({
  gameName: z.string().min(1, "Digite o nome do jogo"),
  rating: z.number().int().min(0).max(10, "Nota deve estar entre 0 e 10"),
  comment: z.string(),
});

export type GameFormInput = z.infer<typeof GameFormInputSchema>;

export const GameDataSchema = z.object({
  name: z.string().min(1, "Nome do jogo é obrigatório"),
  image: z.string().url().nullable(),
  released: z.string().nullable(),
  rating: z.number().int().min(0).max(10),
  comment: z.string(),
});

export type GameData = z.infer<typeof GameDataSchema>;

export const SavedGameSchema = GameDataSchema.extend({
  id: z.number(),
  createdAt: z.string(),
});

export type SavedGame = z.infer<typeof SavedGameSchema>;

export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues?.[0]?.message || "Dados inválidos";
      return { success: false, error: message };
    }
    return { success: false, error: "Erro ao validar dados" };
  }
}
