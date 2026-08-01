import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRightPanel } from "@/layouts/right-panel";
import { OrganizationStatusBadge } from "./OrganizationStatusBadge";
import { OrganizationWorkspace } from "./OrganizationWorkspace";
import type { OrganizationSummary } from "../types";

interface OrganizationsTableProps {
  organizations: OrganizationSummary[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelected?: (id: string) => void;
  onToggleSelectAll?: () => void;
  emptyMessage?: string;
}

export function OrganizationsTable({
  organizations, isLoading, selectable = false, selectedIds, onToggleSelected, onToggleSelectAll,
  emptyMessage = "No gyms yet.",
}: OrganizationsTableProps) {
  const { open: openPanel } = useRightPanel();
  const allSelected = selectable && organizations.length > 0 && organizations.every((o) => selectedIds?.has(o.id));
  const columnCount = selectable ? 7 : 6;

  return (
    <div className="@container">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} /></TableHead>}
            <TableHead>Name</TableHead>
            <TableHead className="hidden @2xl:table-cell">Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden @xl:table-cell">Leads</TableHead>
            <TableHead className="hidden @2xl:table-cell">Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={columnCount} className="h-24 text-center text-sm text-muted-foreground">Loading gyms...</TableCell></TableRow>}
          {!isLoading && organizations.length === 0 && <TableRow><TableCell colSpan={columnCount} className="h-24 text-center text-sm text-muted-foreground">{emptyMessage}</TableCell></TableRow>}
          {organizations.map((org) => (
            <TableRow key={org.id}>
              {selectable && <TableCell><Checkbox checked={selectedIds?.has(org.id)} onCheckedChange={() => onToggleSelected?.(org.id)} /></TableCell>}
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell className="hidden text-sm text-muted-foreground @2xl:table-cell">{org.slug}</TableCell>
              <TableCell><OrganizationStatusBadge id={org.id} status={org.status} /></TableCell>
              <TableCell className="hidden text-sm text-muted-foreground @xl:table-cell">{org.leadCount}</TableCell>
              <TableCell className="hidden text-sm text-muted-foreground @2xl:table-cell">{formatDistanceToNow(new Date(org.createdAt), { addSuffix: true })}</TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="ghost" size="icon" onClick={() => openPanel(<OrganizationWorkspace organizationId={org.id} />, org.name)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}