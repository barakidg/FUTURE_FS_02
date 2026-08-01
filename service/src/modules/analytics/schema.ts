import { z } from "zod";

export const ANALYTICS_PERIODS = ["today", "7d", "this_month", "this_year", "all"] as const;
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export const periodQuerySchema = z.object({
  period: z.enum(ANALYTICS_PERIODS).optional().default("all"),
});
export type PlatformAnalyticsQuery = z.infer<typeof periodQuerySchema>;