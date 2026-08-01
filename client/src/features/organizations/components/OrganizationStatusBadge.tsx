import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useUpdateOrganizationStatus } from "../hooks";
import { ORGANIZATION_STATUS_LABELS, type OrganizationStatus } from "../types";

const STATUS_STYLES: Record<OrganizationStatus, string> = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SUSPENDED: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ARCHIVED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
};

const ALL_STATUSES: OrganizationStatus[] = ["ACTIVE", "SUSPENDED", "ARCHIVED"];

export function OrganizationStatusBadge({ id, status }: { id: string; status: OrganizationStatus }) {
  const [open, setOpen] = useState(false);
  const updateStatus = useUpdateOrganizationStatus();
  const otherStatuses = ALL_STATUSES.filter((s) => s !== status);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn("inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium outline-none", STATUS_STYLES[status])}
        disabled={updateStatus.isPending}
      >
        {updateStatus.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : ORGANIZATION_STATUS_LABELS[status]}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {otherStatuses.map((next) => (
          <DropdownMenuItem key={next} onClick={() => updateStatus.mutate({ id, status: next })}>
            {ORGANIZATION_STATUS_LABELS[next]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}