import { z } from "zod";

/**
 * Schema para dados de um jogo encontrado na API RAWG
 */
export const SearchedGameSchema = z.object({
  name: z.string().min(1, "Nome do jogo é obrigatório"),
  image: z.string().nullable().default(null),
  released: z.string().nullable().default(null),
  rating: z.number().nullable().default(null),
});

/**
 * Schema para validar inputs do formulário
 */
export const GameFormInputSchema = z.object({
  gameName: z.string().min(1, "Digite o nome do jogo"),
  rating: z.number().int().min(0).max(10, "Nota deve estar entre 0 e 10"),
  comment: z.string(),
});

/**
 * Schema para validar dados completos do jogo a ser salvo
 */
export const GameDataSchema = z.object({
  name: z.string().min(1, "Nome do jogo é obrigatório"),
  image: z.string().url().nullable(),
  released: z.string().nullable(),
  rating: z.number().int().min(0).max(10),
  comment: z.string(),
});

/**
 * Schema para validar dados do jogo após criação (com id e createdAt)
 */
export const SavedGameSchema = GameDataSchema.extend({
  id: z.number(),
  createdAt: z.string(),
});

/**
 * Valida dados e retorna erros amigáveis
 * @param {*} data - Dados a validar
 * @param {z.ZodSchema} schema - Schema Zod para validação
 * @returns {{success: boolean, error?: string, data?: *}}
 */
export function validateData(data, schema) {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors?.[0]?.message || "Dados inválidos";
      return { success: false, error: message };
    }
    return { success: false, error: "Erro ao validar dados" };
  }
}
