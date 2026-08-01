import type { AnalyticsPeriod } from "../types";

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7D" },
  { value: "this_month", label: "This Month" },
  { value: "this_year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export function PeriodFilter({
  value,
  onChange,
}: {
  value: AnalyticsPeriod;
  onChange: (p: AnalyticsPeriod) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-xs">
      {PERIODS.map((period) => {
        const isActive = value === period.value;
        return (
          <button
            key={period.value}
            onClick={() => onChange(period.value)}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-all ${
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {period.label}
          </button>
        );
      })}
    </div>
  );
}