import { z } from "zod";
import {
  ChartDataPointSchema,
  MetricCardDataSchema,
  NavItemSchema,
  RecentSaleSchema,
} from "@/features/dashboard/schemas";

export type NavItem = z.infer<typeof NavItemSchema>;
export type MetricCardData = z.infer<typeof MetricCardDataSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
export type RecentSale = z.infer<typeof RecentSaleSchema>;
