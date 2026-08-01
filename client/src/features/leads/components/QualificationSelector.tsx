import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateLeadQualification } from "../hooks";
import { LEAD_QUALIFICATION_LABELS, type Lead, type LeadQualification } from "../types";

const OPTIONS: Exclude<LeadQualification, null>[] = ["HOT", "WARM", "COLD"];

const ACTIVE_STYLES: Record<Exclude<LeadQualification, null>, string> = {
  HOT: "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  WARM: "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COLD: "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function LeadQualificationSelector({ lead }: { lead: Lead }) {
  const updateQualification = useUpdateLeadQualification();

  function handleSelect(value: Exclude<LeadQualification, null>) {
    const next = lead.qualification === value ? null : value; // clicking the active one clears it
    updateQualification.mutate({ id: lead.id, qualification: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {updateQualification.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      {OPTIONS.map((value) => {
        const isActive = lead.qualification === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleSelect(value)}
            disabled={updateQualification.isPending}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer",
              isActive ? ACTIVE_STYLES[value] : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {LEAD_QUALIFICATION_LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}