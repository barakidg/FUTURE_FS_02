import { useState, type ReactElement } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { CopyButton } from "@/layouts/components/CopyButton";
import { useCreateApiKey, useRotateApiKey } from "../hooks";

interface GenerateKeyDialogProps {
  mode: "create" | "rotate";
  trigger?: ReactElement;
}
export function GenerateKeyDialog({ mode, trigger }: GenerateKeyDialogProps) {
  const [open, setOpen] = useState(false);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const createKey = useCreateApiKey();
  const rotateKey = useRotateApiKey();
  const mutation = mode === "create" ? createKey : rotateKey;

  function handleGenerate() {
    mutation.mutate(undefined, { onSuccess: (result) => setIssuedKey(result.key) });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setIssuedKey(null); 
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent>
        {!issuedKey ? (
          <>
            <DialogHeader>
              <DialogTitle>{mode === "create" ? "Generate API key" : "Regenerate API key"}</DialogTitle>
              <DialogDescription>
                {mode === "create"
                  ? "This key authorizes your website's lead-capture requests."
                  : "Your current key stops working immediately. Update your website's snippet with the new key after this."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
              <Button onClick={handleGenerate} disabled={mutation.isPending}>
                {mutation.isPending ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Your new API key</DialogTitle>
              <DialogDescription className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Copy it now — you won't be able to see it again after closing this dialog.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2">
              <code className="min-w-0 flex-1 break-all text-sm">{issuedKey}</code>
              <CopyButton value={issuedKey} />
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenChange(false)}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}