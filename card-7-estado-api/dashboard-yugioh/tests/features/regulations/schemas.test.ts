import { describe, expect, it } from "vitest";
import {
  ExternalRegulationSchema,
  GameModeSchema,
  RegulationDataSchema,
} from "@/features/regulations/schemas";

describe("regulation schemas", () => {
  it("aceita as modalidades suportadas", () => {
    expect(GameModeSchema.safeParse("master-duel").success).toBe(true);
    expect(GameModeSchema.safeParse("tcg").success).toBe(true);
    expect(GameModeSchema.safeParse("ocg").success).toBe(true);
  });

  it("rejeita modalidade desconhecida", () => {
    expect(GameModeSchema.safeParse("duel-links").success).toBe(false);
  });

  it("valida a resposta externa", () => {
    expect(
      ExternalRegulationSchema.safeParse({
        date: "2026-07-01",
        regulation: { "4023": 1, "4095": 0 },
      }).success,
    ).toBe(true);
  });

  it("rejeita limites fora de 0, 1 e 2", () => {
    expect(
      RegulationDataSchema.safeParse({
        date: "2026-07-01",
        cards: [{ cardId: "4023", limit: 3 }],
      }).success,
    ).toBe(false);
  });
});
