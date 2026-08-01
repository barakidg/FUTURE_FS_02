import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/layouts/components/ConfirmDialog";
import { ComingSoon } from "@/layouts/components/ComingSoon";
import { SectionSwitcher } from "@/layouts/components/workspace/SectionSwitcher";
import { useRightPanel, type LeadSection } from "@/layouts/right-panel";
import { useDeleteLead, useLead } from "../hooks";
import { LeadDetailsSection } from "./workspace/LeadDetailsSection";
import { LeadNotesSection } from "./workspace/LeadNotesSection";
import { LeadQualificationSelector } from "./QualificationSelector";
import { LeadStatusSelect } from "./workspace/LeadStatusSelect";
import type { Lead } from "../types";

const LEAD_SECTIONS = [
  { value: "details" as const, label: "Details" },
  { value: "notes" as const, label: "Notes" },
  { value: "email" as const, label: "Email" },
];

interface LeadWorkspaceProps {
  leadId: string;
  initialLead?: Lead;
  section: LeadSection;
  onSectionChange: (section: LeadSection) => void;
}

export function LeadWorkspace({ leadId, initialLead, section, onSectionChange }: LeadWorkspaceProps) {
  const { data: lead, isLoading } = useLead(leadId);
  const currentLead = lead ?? initialLead;
  const deleteLead = useDeleteLead();
  const { close } = useRightPanel();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (isLoading && !currentLead) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!currentLead) {
    return <p className="text-sm text-muted-foreground">Lead not found.</p>;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 space-y-4 border-b pb-4">
        <LeadQualificationSelector lead={currentLead} />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">{currentLead.name}</h2>
            {currentLead.email && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{currentLead.email}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-destructive hover:text-destructive"
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete lead"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <LeadStatusSelect lead={currentLead} />

        <SectionSwitcher value={section} onValueChange={onSectionChange} sections={LEAD_SECTIONS} />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-4">
        {section === "details" && <LeadDetailsSection lead={currentLead} />}
        {section === "notes" && <LeadNotesSection leadId={currentLead.id} />}
        {section === "email" && (
          <ComingSoon
            title="Email"
            description="Sending emails needs a verified sending domain — this unlocks once one is configured. Coming soon!"
          />
        )}
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete this lead?"
        description="This permanently removes the lead and its history. This can't be undone."
        confirmLabel="Delete"
        destructive
        isLoading={deleteLead.isPending}
        onConfirm={() =>
          deleteLead.mutate(currentLead.id, {
            onSuccess: () => {
              setConfirmingDelete(false);
              close();
            },
          })
        }
      />
    </div>
  );
}