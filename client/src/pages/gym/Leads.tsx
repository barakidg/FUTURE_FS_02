import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/layouts/components/ConfirmDialog";
import { PaginationControls } from "@/layouts/components/PaginationControls";
import { useRightPanel } from "@/layouts/right-panel";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useLeads, useDeleteLead } from "@/features/leads/hooks";
import { LeadFilters } from "@/features/leads/components/LeadFilters";
import { LeadsTable } from "@/features/leads/components/LeadsTable";
import { AddLeadForm } from "@/features/leads/components/AddLeadForm";
import type { LeadsQuery } from "@/features/leads/types";
import { BulkDeleteButton } from "@/features/leads/components/BulkDeleteButton";

function parseQuery(params: URLSearchParams): LeadsQuery {
  return {
    status: (params.get("status") as LeadsQuery["status"]) || undefined,
    qualification: (params.get("qualification") as LeadsQuery["qualification"]) || undefined,
    search: params.get("search") || undefined,
    sortBy: (params.get("sortBy") as LeadsQuery["sortBy"]) || "createdAt",
    sortOrder: (params.get("sortOrder") as LeadsQuery["sortOrder"]) || "desc",
    page: Number(params.get("page")) || 1,
    pageSize: Number(params.get("pageSize")) || 10,
  };
}

function toParams(query: LeadsQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.qualification) params.set("qualification", query.qualification);
  if (query.search) params.set("search", query.search);
  params.set("sortBy", query.sortBy);
  params.set("sortOrder", query.sortOrder);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  return params;
}

export default function LeadsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);

  const [searchInput, setSearchInput] = useState(query.search ?? "");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const effectiveQuery: LeadsQuery = { ...query, search: debouncedSearch || undefined };
  const { data, isLoading } = useLeads(effectiveQuery);
  const deleteLead = useDeleteLead();
  const { open: openPanel } = useRightPanel();

  const updateQuery = useCallback(
    (patch: Partial<LeadsQuery>) => {
      setSearchParams(toParams({ ...query, ...patch, page: patch.page ?? 1 }));
    },
    [query, setSearchParams],
  );

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const leads = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads Management</h1>
          <p className="text-sm text-muted-foreground">Track, manage and convert your incoming fitness inquiries.</p>
        </div>
        <div className="flex items-center gap-2">
          <BulkDeleteButton selectedIds={Array.from(selectedIds)} onDeleted={() => setSelectedIds(new Set())} />          <Button onClick={() => openPanel(<AddLeadForm />, "Add New Lead")} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-500/20 active:scale-[0.98] transition-all">
            <UserPlus className="h-4 w-4 mr-1.5" />
            Add New Lead
          </Button>
        </div>
      </div>

      <LeadFilters query={query} searchInput={searchInput} onSearchInputChange={setSearchInput} onChange={updateQuery} />

      <div className="rounded-lg border bg-card">
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          selectable
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onToggleSelectAll={() => setSelectedIds(selectedIds.size === leads.length ? new Set() : new Set(leads.map((l) => l.id)))}
          onDeleteRequest={setPendingDeleteId}
        />
        {data && (
          <PaginationControls
            page={data.page} pageSize={data.pageSize} total={data.total} totalPages={data.totalPages}
            onPageChange={(page) => updateQuery({ page })}
            onPageSizeChange={(pageSize) => updateQuery({ pageSize })}
          />
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete this lead?"
        description="This permanently removes the lead and its history. This can't be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteLead.isPending}
        onConfirm={() => pendingDeleteId && deleteLead.mutate(pendingDeleteId, { onSuccess: () => setPendingDeleteId(null) })}
      />
    </div>
  );
}