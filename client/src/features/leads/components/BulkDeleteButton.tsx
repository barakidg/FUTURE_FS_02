import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/layouts/components/ConfirmDialog";
import { useBulkDeleteLeads } from "../hooks";

export function BulkDeleteButton({ selectedIds, onDeleted }: { selectedIds: string[]; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const bulkDelete = useBulkDeleteLeads();

  if (selectedIds.length === 0) return null;

  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setConfirming(true)} className="h-7 gap-1 px-2.5 text-xs">
        <Trash2 className="h-3.5 w-3.5" />
        Delete ({selectedIds.length})
      </Button>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Delete ${selectedIds.length} lead${selectedIds.length > 1 ? "s" : ""}?`}
        description="This permanently removes the selected leads and their history. This can't be undone."
        confirmLabel="Delete"
        destructive
        isLoading={bulkDelete.isPending}
        onConfirm={() =>
          bulkDelete.mutate(selectedIds, { onSuccess: () => { setConfirming(false); onDeleted(); } })
        }
      />
    </>
  );
}