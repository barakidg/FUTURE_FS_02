import { cn } from "@/lib/utils";

export function Logo({ labelClassName }: { labelClassName?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-primary to-primary/85 text-primary-foreground text-sm font-bold shadow-xs ring-1 ring-primary/20">
        G
      </div>
      <span className={cn("font-semibold whitespace-nowrap transition-opacity duration-200 delay-100 opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:hidden", labelClassName)}>GymLeadHub</span>
    </div>
  );
}