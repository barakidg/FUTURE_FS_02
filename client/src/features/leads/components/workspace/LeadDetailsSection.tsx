import { format } from "date-fns";
import { Calendar, Dumbbell, Mail, Phone } from "lucide-react";
import type { Lead } from "../../types";
import { getLabelColorClasses } from "../../labelColor";

function DefinitionRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border/60 py-1 last:border-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value ?? <span className="text-muted-foreground">—</span>}</dd>
    </div>
  );
}

function LeadLabelBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getLabelColorClasses(label)}`}
    >
      {label}
    </span>
  );
}

export function LeadDetailsSection({ lead }: { lead: Lead }) {
  return (
    
      <dl>
        <DefinitionRow label="Name" value={lead.name} />
        <DefinitionRow
          label="Email"
          value={
            lead.email && (
              <span className="inline-flex items-center gap-1.5 break-all">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="inline-flex w-fit cursor-pointer items-center gap-1.2 text-sm text-muted-foreground hover:text-foreground">
                      <span>{lead.email}</span>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
              </span>
            )
          }
        />
        <DefinitionRow
          label="Phone"
          value={
            lead.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {lead.phone ? (
                    <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="inline-flex w-fit cursor-pointer items-center gap-1.2 text-xs text-muted-foreground hover:text-foreground">
                      <span>{lead.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
              </span>
            )
          }
        />
        <DefinitionRow label="Interest" value={lead.interest} />
        <DefinitionRow label="Budget" value={lead.budget} />
        <DefinitionRow label="Message" value={lead.message} />
        <DefinitionRow
            label="Label"
            value={lead.label ? <LeadLabelBadge label={lead.label} /> : undefined}
          />
        <DefinitionRow
          label="Trainer"
          value={
            lead.wantsTrainer ? (
              <span className="inline-flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" />
                Wants a trainer
              </span>
            ) : (
              "No"
            )
          }
        />
        <DefinitionRow
          label="Source"
          value={lead.sourceType === "web_form" ? "Website form" : "Manually added"}
        />
        <DefinitionRow
          label="Added"
          value={
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {format(new Date(lead.createdAt), "PPp")}
            </span>
          }
        />
  </dl>
  );
}
