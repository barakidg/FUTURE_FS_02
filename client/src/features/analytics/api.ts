import { api } from "@/lib/axios";
import type { AnalyticsPeriod, GymAnalytics, LeadsTimeseriesPoint , PlatformAnalytics} from "./types";

export async function getGymAnalytics(period: AnalyticsPeriod): Promise<GymAnalytics> {
  const { data } = await api.get<GymAnalytics>("/api/analytics/gym", { params: { period } });
  return data;
}

export async function getGymLeadsTimeseries(period: AnalyticsPeriod): Promise<LeadsTimeseriesPoint[]> {
  const { data } = await api.get<LeadsTimeseriesPoint[]>("/api/analytics/gym/timeseries", { params: { period } });
  return data;
}

export async function getPlatformAnalytics(period: AnalyticsPeriod): Promise<PlatformAnalytics> {
  const { data } = await api.get<PlatformAnalytics>("/api/analytics/platform", { params: { period } });
  return data;
}