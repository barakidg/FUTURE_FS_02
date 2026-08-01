import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUpdateLeadStatus } from "../../hooks";
import {
  LEAD_STATUS_LABELS,
  LEAD_STATUS_TRANSITIONS,
  type Lead,
  type LeadStatus,
} from "../../types";

const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "text-blue-600 dark:text-blue-400",
  CONTACTED: "text-amber-600 dark:text-amber-400",
  CONVERTED: "text-emerald-600 dark:text-emerald-400",
  LOST: "text-rose-600 dark:text-rose-400",
};

export function LeadStatusSelect({ lead }: { lead: Lead }) {
  const updateStatus = useUpdateLeadStatus();
  const allowedNext = LEAD_STATUS_TRANSITIONS[lead.status];
  const options: LeadStatus[] = [lead.status, ...allowedNext.filter((s) => s !== lead.status)];

  function handleChange(next: LeadStatus | null) {
    if (!next || next === lead.status) return;
    updateStatus.mutate({ id: lead.id, status: next });
  }

  return (
    <Select value={lead.status} onValueChange={handleChange} disabled={updateStatus.isPending}>
      <SelectTrigger
        size="sm"
        className={cn("w-full", STATUS_STYLES[lead.status])}
        aria-label="Lead status"
      >
        {updateStatus.isPending ? (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </span>
        ) : (
          <SelectValue>{LEAD_STATUS_LABELS[lead.status]}</SelectValue>
        )}
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((status) => (
          <SelectItem key={status} value={status}>
            {LEAD_STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
