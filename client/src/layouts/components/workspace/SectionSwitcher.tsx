import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export interface SectionOption<T extends string> {
  value: T;
  label: string;
}

interface SectionSwitcherProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  sections: SectionOption<T>[];
  className?: string;
}

export function SectionSwitcher<T extends string>({
  value,
  onValueChange,
  sections,
  className,
}: SectionSwitcherProps<T>) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        const selected = next[0] as T | undefined;
        if (selected) onValueChange(selected);
      }}
      className={cn("w-full", className)}
    >
      {sections.map((section) => (
        <ToggleGroupItem key={section.value} value={section.value} className="flex-1 cursor-pointer">
          {section.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
