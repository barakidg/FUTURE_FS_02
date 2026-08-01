import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUpdateLeadStatus } from "../hooks";
import { LEAD_STATUS_LABELS, LEAD_STATUS_TRANSITIONS, type Lead } from "../types";

const STATUS_STYLES = {
  NEW: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  CONTACTED: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  CONVERTED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  LOST: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

export function LeadStatusBadge({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateLeadStatus();
  
  const allowedNext = LEAD_STATUS_TRANSITIONS[lead.status];


  if (allowedNext.length === 0) {
    return <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[lead.status])}>{LEAD_STATUS_LABELS[lead.status]}</Badge>;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn("inline-flex items-center cursor-pointer gap-1 rounded-full border px-2.5 py-1 text-xs font-medium outline-none", STATUS_STYLES[lead.status])}
        disabled={updateStatus.isPending}
      >
        {updateStatus.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : LEAD_STATUS_LABELS[lead.status]}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {allowedNext.map((next) => (
          <DropdownMenuItem key={next} onClick={() => updateStatus.mutate({ id: lead.id, status: next })}>
            {LEAD_STATUS_LABELS[next]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}