import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import * as analyticsApi from "./api";
import type { AnalyticsPeriod } from "./types";

export function useGymAnalytics(period: AnalyticsPeriod) {
  return useQuery({ queryKey: queryKeys.analytics.gym(period), queryFn: () => analyticsApi.getGymAnalytics(period) });
}

export function useGymLeadsTimeseries(period: AnalyticsPeriod) {
  return useQuery({ queryKey: queryKeys.analytics.gymTimeseries(period), queryFn: () => analyticsApi.getGymLeadsTimeseries(period) });
}

export function usePlatformAnalytics(period: AnalyticsPeriod) {
  return useQuery({ queryKey: queryKeys.analytics.platform(period), queryFn: () => analyticsApi.getPlatformAnalytics(period) });
}