import type { z } from "zod";
import type { ValidationResult } from "@/types/api";

export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message ?? "Dados invalidos",
  };
}
