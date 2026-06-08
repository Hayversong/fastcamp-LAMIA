/**
 * Tipos relacionados a APIs e Responses
 */

/**
 * Resultado de validação genérico
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Resposta de erro da API
 */
export interface ApiError {
  error: string;
  status?: number;
}

/**
 * Estrutura da resposta da RAWG API
 */
export interface RawgApiResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}
