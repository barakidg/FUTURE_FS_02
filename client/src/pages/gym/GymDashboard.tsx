import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/hooks";
import { useRightPanel } from "@/layouts/right-panel";
import { useLeads, useDeleteLead } from "@/features/leads/hooks";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { AddLeadForm } from "@/features/leads/components/AddLeadForm";
import { BulkDeleteButton } from "@/features/leads/components/BulkDeleteButton";
import { ListTodaysTasks } from "@/features/tasks/components/ListTodaysTasks";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function GymDashboard() {
  const { data: user } = useSession();
  const { open: openPanel } = useRightPanel();
  const { data: newLeads, isLoading } = useLeads({ status: "NEW", sortBy: "createdAt", sortOrder: "desc", page: 1, pageSize: 5 });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const deleteLead = useDeleteLead();
  const leadsList = newLeads?.items ?? [];

  const handleToggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (leadsList.length === 0) return;
    const allSelected = leadsList.every((lead) => selectedIds.has(lead.id));

    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leadsList.map((l) => l.id)));
    }
  };

 

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{getGreeting()}, {user?.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your gym today.</p>
        </div>
        <Button
          onClick={() => openPanel(<AddLeadForm />, "Add New Lead")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-500/20 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add New Lead
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium">New Leads</span>
            <BulkDeleteButton selectedIds={Array.from(selectedIds)} onDeleted={() => setSelectedIds(new Set())} />
          </div>

          <Link
            to="/leads"
            className="group inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-2.5 py-1 rounded-full cursor-pointer"
          >
            <span>View all leads</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <LeadsTable
          leads={leadsList}
          isLoading={isLoading}
          emptyMessage="No new leads right now."
          selectable
          selectedIds={selectedIds}
          onToggleSelected={handleToggleSelected}
          onToggleSelectAll={handleToggleSelectAll}
          onDeleteRequest={(id) => deleteLead.mutate(id)}
        />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 py-3"><span className="font-medium">Today's Tasks</span></div>
        <ListTodaysTasks />
      </div>
    </div>
  );
}