import { Building2, TrendingUp, Percent, ShieldCheck } from "lucide-react";
import { StatCard } from "@/features/analytics/components/StatCard";
import { ComingSoon } from "@/layouts/components/ComingSoon";
import { useSession } from "@/features/auth/hooks";
import { usePlatformAnalytics } from "@/features/analytics/hooks";
import { useOrganizations } from "@/features/organizations/hooks";
import { OrganizationsTable } from "@/features/organizations/components/OrganizationsTable";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const { data: user } = useSession();
  const { data: analytics } = usePlatformAnalytics("all");
  const { data: newOrganizations, isLoading } = useOrganizations({ sortBy: "createdAt", sortOrder: "desc", page: 1, pageSize: 5 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}, {user?.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here's how the platform is doing.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Gyms" value={analytics?.organizations.total ?? "—"} icon={Building2} accentClassName="text-blue-600 dark:text-blue-400" />
        <StatCard label="Active Gyms" value={analytics?.organizations.byStatus.ACTIVE ?? "—"} icon={ShieldCheck} accentClassName="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Total Leads" value={analytics?.leads.total ?? "—"} icon={TrendingUp} accentClassName="text-violet-600 dark:text-violet-400" />
        <StatCard label="Conversion Rate" value={analytics ? `${Math.round(analytics.leads.conversionRate * 100)}%` : "—"} icon={Percent} accentClassName="text-amber-600 dark:text-amber-400" />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3"><span className="font-medium">Newly Joined Gyms</span></div>
        <OrganizationsTable organizations={newOrganizations?.items ?? []} isLoading={isLoading} emptyMessage="No gyms have joined yet." />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3"><span className="font-medium">Help Reports</span></div>
        <ComingSoon title="Help Reports" description="Support requests from gyms will show up here." />
      </div>
    </div>
  );
}