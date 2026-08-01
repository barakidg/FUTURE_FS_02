export const ANALYTICS_PERIODS = ["today", "7d", "this_month", "this_year", "all"] as const;
export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export interface GymAnalytics {
  period: AnalyticsPeriod;
  leads: {
    total: number;
    byStatus: Record<string, number>;
    byQualification: Record<string, number>;
    bySourceType: Record<string, number>;
    wantsTrainerCount: number;
    convertedCount: number;
    lostCount: number;
    conversionRate: number;
  };
  tasks: { pending: number; overdue: number };
}

export interface LeadsTimeseriesPoint {
  date: string;
  totalLeads: number;
  convertedLeads: number;
}

export interface PlatformAnalytics {
  period: AnalyticsPeriod;
  organizations: { total: number; byStatus: Record<string, number> };
  leads: { total: number; converted: number; conversionRate: number; byStatus: Record<string, number> };
}