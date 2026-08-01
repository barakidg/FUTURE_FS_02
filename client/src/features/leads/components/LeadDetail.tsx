import { format } from "date-fns";
import { Mail, Phone, Dumbbell, Calendar } from "lucide-react";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadQualificationBadge } from "./LeadQualificationBadge";
import type { Lead } from "../types";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value || <span className="text-muted-foreground">—</span>}</p>
    </div>
  );
}

export function LeadDetailView({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LeadStatusBadge lead={lead} />
        <LeadQualificationBadge qualification={lead.qualification} />
      </div>
      <div className="space-y-4">
        <Field label="Name" value={lead.name} />
        <Field label="Email" value={lead.email && <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{lead.email}</span>} />
        <Field label="Phone" value={lead.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>} />
        <Field label="Interest" value={lead.interest} />
        <Field label="Budget" value={lead.budget} />
        <Field label="Message" value={lead.message} />
        <Field label="Wants a trainer" value={lead.wantsTrainer && <span className="inline-flex items-center gap-1.5"><Dumbbell className="h-3.5 w-3.5" />Yes</span>} />
        <Field label="Source" value={lead.sourceType === "web_form" ? "Website form" : "Manually added"} />
        <Field label="Added" value={<span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{format(new Date(lead.createdAt), "PPp")}</span>} />
      </div>
    </div>
  );
}