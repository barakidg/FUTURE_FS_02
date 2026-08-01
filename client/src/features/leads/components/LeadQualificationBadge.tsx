import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_QUALIFICATION_LABELS, type LeadQualification } from "../types";

const QUALIFICATION_STYLES = {
  HOT: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  WARM: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  COLD: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
} as const;

export function LeadQualificationBadge({ qualification }: { qualification: LeadQualification }) {
  if (!qualification) return <span className="text-xs text-muted-foreground">—</span>;
  return <Badge variant="outline" className={cn("font-medium", QUALIFICATION_STYLES[qualification])}>{LEAD_QUALIFICATION_LABELS[qualification]}</Badge>;
}