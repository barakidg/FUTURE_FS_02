import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  itemLabel?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function PaginationControls({ page, pageSize, total, totalPages, onPageChange, onPageSizeChange, itemLabel = "leads" }: PaginationControlsProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t bg-card/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span>Showing</span>
        <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 font-mono font-medium text-foreground border border-border/50">
          {from}–{to}
        </span>
        <span>of</span>
        <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40">
          {total}
        </span>
        <span>{itemLabel}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[68px] text-xs cursor-pointer bg-background/50 border-input/60 focus:ring-1 focus:ring-indigo-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="text-xs">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Stepper Buttons */}
        <div className="flex items-center gap-1 bg-background/50 border border-input/60 p-0.5 rounded-lg shadow-2xs">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md cursor-pointer disabled:cursor-not-allowed hover:bg-accent"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="px-2 font-mono font-medium text-foreground">
            {page} <span className="text-muted-foreground/60 font-sans font-normal">/</span> {totalPages || 1}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md cursor-pointer disabled:cursor-not-allowed hover:bg-accent"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}