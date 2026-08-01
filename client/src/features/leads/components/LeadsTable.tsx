import { formatDistanceToNow } from "date-fns";
import { Eye, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRightPanel } from "@/layouts/right-panel";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadQualificationBadge } from "./LeadQualificationBadge";
import type { Lead } from "../types";

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelected?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onDeleteRequest?: (id: string) => void;
  emptyMessage?: string;
}

export function LeadsTable({
  leads, isLoading, selectable = false, selectedIds, onToggleSelected, onToggleSelectAll,
  onDeleteRequest, emptyMessage = "No leads yet.",
}: LeadsTableProps) {
  const { openLead } = useRightPanel();
  const allSelected = selectable && leads.length > 0 && leads.every((l) => selectedIds?.has(l.id));
  const columnCount = selectable ? 8 : 7;

  return (
    <div className="@container">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} /></TableHead>}
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="hidden @4xl:table-cell">Interest</TableHead>
            <TableHead className="hidden @xl:table-cell">Qualification</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden @3xl:table-cell">Created</TableHead>
            <TableHead className="hidden text-right @2xl:table-cell">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableRow><TableCell colSpan={columnCount} className="h-24 text-center text-sm text-muted-foreground">Loading leads...</TableCell></TableRow>}
          {!isLoading && leads.length === 0 && <TableRow><TableCell colSpan={columnCount} className="h-24 text-center text-sm text-muted-foreground">{emptyMessage}</TableCell></TableRow>}
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              {selectable && <TableCell><Checkbox checked={selectedIds?.has(lead.id)} onCheckedChange={() => onToggleSelected?.(lead.id)} /></TableCell>}
              <TableCell>
                <button
                  type="button"
                  onClick={() => openLead(lead)}
                  className="cursor-pointer text-left font-medium text-foreground hover:text-primary"
                >
                  {lead.name.split(" ")[0]}
                </button>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="inline-flex w-fit cursor-pointer items-center gap-1.2 text-sm text-muted-foreground hover:text-foreground">
                      <span>{lead.email}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                  {lead.phone ? (
                    <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="inline-flex w-fit cursor-pointer items-center gap-1.2 text-xs text-muted-foreground hover:text-foreground">
                      <span>{lead.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden @4xl:table-cell">
                <div className="text-xs text-muted-foreground">{lead.interest ?? "—"}</div>
              </TableCell>
              <TableCell className="hidden @xl:table-cell"><LeadQualificationBadge qualification={lead.qualification} /></TableCell>
              <TableCell><LeadStatusBadge lead={lead} /></TableCell>
              <TableCell className="hidden text-sm text-muted-foreground @3xl:table-cell">
                {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="hidden @2xl:table-cell">
                <div className="flex items-center justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon" onClick={() => openLead(lead)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>Open workspace</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon" onClick={() => openLead(lead, "notes")}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <TooltipContent>Notes</TooltipContent>
                  </Tooltip>
                  {onDeleteRequest && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDeleteRequest(lead.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}