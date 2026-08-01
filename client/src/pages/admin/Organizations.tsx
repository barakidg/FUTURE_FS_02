import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationControls } from "@/layouts/components/PaginationControls";
import { useOrganizations } from "@/features/organizations/hooks";
import { OrganizationsTable } from "@/features/organizations/components/OrganizationsTable";
import { BulkStatusButton } from "@/features/organizations/components/BulkStatusButton";
import type { OrganizationsQuery } from "@/features/organizations/types";

function parseQuery(params: URLSearchParams): OrganizationsQuery {
  return {
    status: (params.get("status") as OrganizationsQuery["status"]) || undefined,
    sortBy: (params.get("sortBy") as OrganizationsQuery["sortBy"]) || "createdAt",
    sortOrder: (params.get("sortOrder") as OrganizationsQuery["sortOrder"]) || "desc",
    page: Number(params.get("page")) || 1,
    pageSize: Number(params.get("pageSize")) || 10,
  };
}

function toParams(query: OrganizationsQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  params.set("sortBy", query.sortBy);
  params.set("sortOrder", query.sortOrder);
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  return params;
}

export default function OrganizationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useOrganizations(query);

  const updateQuery = useCallback(
    (patch: Partial<OrganizationsQuery>) => setSearchParams(toParams({ ...query, ...patch, page: patch.page ?? 1 })),
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

  const organizations = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Gyms</h1>
          <p className="text-sm text-muted-foreground">Every gym on the platform, and their current status.</p>
        </div>
        <div className="flex items-center gap-2">
          <BulkStatusButton selectedIds={Array.from(selectedIds)} onDone={() => setSelectedIds(new Set())} />
          <Select value={query.status ?? "ALL"} onValueChange={(v) => updateQuery({ status: v === "ALL" ? undefined : (v as OrganizationsQuery["status"]) })}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <OrganizationsTable
          organizations={organizations}
          isLoading={isLoading}
          selectable
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
          onToggleSelectAll={() => setSelectedIds(selectedIds.size === organizations.length ? new Set() : new Set(organizations.map((o) => o.id)))}
        />
        {data && (
          <PaginationControls
            page={data.page} pageSize={data.pageSize} total={data.total} totalPages={data.totalPages}
            onPageChange={(page) => updateQuery({ page })}
            onPageSizeChange={(pageSize) => updateQuery({ pageSize })}
            itemLabel="gyms"
          />
        )}
      </div>
    </div>
  );
}