import { z } from "zod";

export const GameModeSchema = z.enum(["master-duel", "tcg", "ocg"]);
export const RegulationLimitSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
]);

export const ExternalRegulationSchema = z.object({
  date: z.iso.date(),
  regulation: z.record(z.string(), RegulationLimitSchema),
});

export const RegulationCardSchema = z.object({
  cardId: z.string().min(1),
  limit: RegulationLimitSchema,
});

export const RegulationDataSchema = z.object({
  date: z.iso.date(),
  cards: z.array(RegulationCardSchema),
});
