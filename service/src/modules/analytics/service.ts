import { prisma } from "../../lib/prisma.js";
import type { AnalyticsPeriod } from "./schema.js";
import { LeadStatus } from "../../generated/prisma/client.js";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (y: number, m: number) => new Date(y, m, 1);
const startOfYear = (y: number) => new Date(y, 0, 1);

function resolvePeriodRange(period: AnalyticsPeriod): { gte: Date} | undefined {
  const now = new Date();
  switch (period) {
    case "today": return { gte: startOfDay(now) };
    case "7d": return { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    case "this_month": return { gte: startOfMonth(now.getFullYear(), now.getMonth()) };
    case "this_year": return { gte: startOfYear(now.getFullYear()) };
    case "all":
    default: return undefined;
  }
}

export async function getPlatformAnalytics(period: AnalyticsPeriod) {
  const range = resolvePeriodRange(period);
  const where = range ? { createdAt: range } : {};

  const [totalOrganizations, organizationsByStatus, totalLeads, leadsByStatus] = await prisma.$transaction([
    prisma.organization.count({ where }),
    prisma.organization.groupBy({ by: ["status"], _count: true, where }),
    prisma.lead.count({ where }),
    prisma.lead.groupBy({ by: ["status"], _count: true, where }),
  ]);

  const converted = leadsByStatus.find((l) => l.status === LeadStatus.CONVERTED)?._count ?? 0;

  return {
    period,
    organizations: {
      total: totalOrganizations,
      byStatus: Object.fromEntries(organizationsByStatus.map((o) => [o.status, o._count])),
    },
    leads: {
      total: totalLeads,
      converted,
      conversionRate: totalLeads ? Number((converted / totalLeads).toFixed(4)) : 0,
      byStatus: Object.fromEntries(leadsByStatus.map((l) => [l.status, l._count])),
    },
  };
}

export async function getGymAnalytics(organizationId: string, period: AnalyticsPeriod) {
  const range = resolvePeriodRange(period);
  const where = { organizationId, ...(range ? { createdAt: range } : {}) };

  const [
    totalLeads,
    statusGroups,
    qualificationGroups,
    sourceGroups,
    wantsTrainerCount,
    pendingTaskCount,
    overdueTaskCount,
  ] = await prisma.$transaction([
    prisma.lead.count({ where }),
    prisma.lead.groupBy({ by: ["status"], where, _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["qualification"], where, _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["sourceType"], where, _count: { _all: true } }),
    prisma.lead.count({ where: { ...where, wantsTrainer: true } }),
    prisma.note.count({ where: { organizationId, taskStatus: "PENDING" } }),
    prisma.note.count({ where: { organizationId, taskStatus: "PENDING", scheduledFor: { lt: new Date() } } }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const g of statusGroups) byStatus[g.status] = g._count._all;

  const byQualification: Record<string, number> = {};
  for (const g of qualificationGroups) byQualification[g.qualification ?? "UNSET"] = g._count._all;

  const bySourceType: Record<string, number> = {};
  for (const g of sourceGroups) bySourceType[g.sourceType] = g._count._all;

  const convertedCount = byStatus[LeadStatus.CONVERTED] ?? 0;
  const lostCount = byStatus[LeadStatus.LOST] ?? 0;
  const conversionRate = totalLeads > 0 ? Number((convertedCount / totalLeads).toFixed(4)) : 0;

  return {
    period,
    leads: {
      total: totalLeads,
      byStatus,
      byQualification,
      bySourceType,
      wantsTrainerCount,
      convertedCount,
      lostCount,
      conversionRate,
    },
    tasks: {
      pending: pendingTaskCount,
      overdue: overdueTaskCount,
    },
  };
}

export interface LeadsTimeseriesPoint {
  date: string;
  totalLeads: number;
  convertedLeads: number;
}

export async function getGymLeadsTimeseries(
  organizationId: string,
  period: AnalyticsPeriod,
): Promise<LeadsTimeseriesPoint[]> {
  const range = resolvePeriodRange(period);
  const since = range?.gte ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await prisma.$queryRaw<{ day: Date; total: bigint; converted: bigint }[]>`
    SELECT
      date_trunc('day', "createdAt") AS day,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'CONVERTED') AS converted
    FROM lead
    WHERE "organizationId" = ${organizationId}
      AND "createdAt" >= ${since}
    GROUP BY day
    ORDER BY day ASC
  `;

  return rows.map((row) => ({
    date: row.day.toISOString().slice(0, 10),
    totalLeads: Number(row.total),
    convertedLeads: Number(row.converted),
  }));
}