import { z } from "zod";
import {
  GameModeSchema,
  RegulationCardSchema,
  RegulationDataSchema,
  RegulationLimitSchema,
} from "./schemas";

export type GameMode = z.infer<typeof GameModeSchema>;
export type RegulationLimit = z.infer<typeof RegulationLimitSchema>;
export type RegulationCard = z.infer<typeof RegulationCardSchema>;
export type RegulationData = z.infer<typeof RegulationDataSchema>;
export type StatusFilter = "all" | `${RegulationLimit}`;
