import { useState } from "react";
import { Users, Inbox, TrendingUp, XCircle, Percent } from "lucide-react";
import { StatCard } from "@/features/analytics/components/StatCard";
import { PeriodFilter } from "@/features/analytics/components/PeriodFilter";
import { LeadsTrendChart } from "@/features/analytics/components/LeadsTrendChart";
import { useGymAnalytics, useGymLeadsTimeseries } from "@/features/analytics/hooks";
import type { AnalyticsPeriod } from "@/features/analytics/types";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("this_month");
  const { data: analytics } = useGymAnalytics(period);
  const { data: timeseries, isLoading: isTimeseriesLoading } = useGymLeadsTimeseries(period);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">See how your leads are performing over time.</p>
        </div>
        <div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Leads" value={analytics?.leads.total ?? "—"} icon={Users} accentClassName="text-blue-600 dark:text-blue-400" />
        <StatCard label="New" value={analytics?.leads.byStatus.NEW ?? "—"} icon={Inbox} accentClassName="text-violet-600 dark:text-violet-400" />
        <StatCard label="Converted" value={analytics?.leads.convertedCount ?? "—"} icon={TrendingUp} accentClassName="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Lost" value={analytics?.leads.lostCount ?? "—"} icon={XCircle} accentClassName="text-muted-foreground" />
        <StatCard label="Conversion Rate" value={analytics ? `${Math.round(analytics.leads.conversionRate * 100)}%` : "—"} icon={Percent} accentClassName="text-amber-600 dark:text-amber-400" />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h2 className="font-medium">Leads Over Time</h2>
          <p className="text-sm text-muted-foreground">Leads created each day, and how many of them have since converted.</p>
        </div>
        {isTimeseriesLoading ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Loading chart...</div>
        ) : (
          <LeadsTrendChart data={timeseries ?? []} />
        )}
      </div>
    </div>
  );
}