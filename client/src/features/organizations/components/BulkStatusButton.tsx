import { useState } from "react";
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/layouts/components/ConfirmDialog";
import { useBulkUpdateOrganizationStatus } from "../hooks";

export function BulkStatusButton({ selectedIds, onDone }: { selectedIds: string[]; onDone: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const bulkUpdate = useBulkUpdateOrganizationStatus();

  if (selectedIds.length === 0) return null;

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setConfirming(true)} className="h-7 gap-1 px-2.5 text-xs">
        <Archive className="h-3.5 w-3.5" />
        Archive ({selectedIds.length})
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Archive ${selectedIds.length} gym${selectedIds.length > 1 ? "s" : ""}?`}
        description="Archived gyms lose dashboard access. You can reactivate them anytime from their status menu — nothing is deleted."
        confirmLabel="Archive"
        isLoading={bulkUpdate.isPending}
        onConfirm={() => bulkUpdate.mutate({ ids: selectedIds, status: "ARCHIVED" }, { onSuccess: () => { setConfirming(false); onDone(); } })}
      />
    </>
  );
}