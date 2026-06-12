import { useCallback } from "react";
import { z } from "zod";
import { ValidationResult } from "@/types";

export function useValidation() {
  const validate = useCallback(
    <T>(data: unknown, schema: z.ZodSchema<T>): ValidationResult<T> => {
      try {
        const validatedData = schema.parse(data);
        return {
          success: true,
          data: validatedData,
        };
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errorMessage = err.issues
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join("; ");
          return {
            success: false,
            error: errorMessage,
          };
        }
        return {
          success: false,
          error: "Erro na validação dos dados",
        };
      }
    },
    [],
  );

  return { validate };
}
