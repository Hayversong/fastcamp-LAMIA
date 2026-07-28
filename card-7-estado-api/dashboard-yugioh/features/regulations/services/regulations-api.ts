import { api } from "@/services/api";
import { RegulationDataSchema } from "../schemas";
import type { GameMode, RegulationData } from "../types";

export async function getCurrentRegulation(
  gameMode: GameMode,
): Promise<RegulationData> {
  const response = await api.get("/regulations", {
    params: { mode: gameMode },
  });

  const parsed = RegulationDataSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error("A resposta da regulamentação possui formato inválido.");
  }

  return parsed.data;
}
