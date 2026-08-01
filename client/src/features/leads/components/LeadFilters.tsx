import { Search, X, Filter, ArrowUpDown, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadsQuery } from "../types";

const ORDER_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "name:asc", label: "Name (A–Z)" },
  { value: "name:desc", label: "Name (Z–A)" },
] as const;

interface LeadFiltersProps {
  query: LeadsQuery;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onChange: (patch: Partial<LeadsQuery>) => void;
}

export function LeadFilters({ query, searchInput, onSearchInputChange, onChange }: LeadFiltersProps) {
  const hasActiveFilters = Boolean(query.status) || Boolean(query.qualification);

  const handleResetFilters = () => {
    onChange({ status: undefined, qualification: undefined });
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border bg-card/60 p-2.5 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder="Search leads..."
          className="h-9 pl-9 pr-8 text-sm border-input/60 bg-background/50 focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0 outline-none"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => onSearchInputChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={query.status ?? "ALL"}
          onValueChange={(v) => onChange({ status: v === "ALL" ? undefined : (v as LeadsQuery["status"]) })}
        >
          <SelectTrigger className="h-9 w-full sm:w-[135px] cursor-pointer bg-background/50 border-input/60 text-xs focus:ring-1 focus:ring-indigo-500/20">
            <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground mr-1" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent align="end" className="text-xs">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={query.qualification ?? "ALL"}
          onValueChange={(v) => onChange({ qualification: v === "ALL" ? undefined : (v as LeadsQuery["qualification"]) })}
        >
          <SelectTrigger className="h-9 w-full sm:w-[145px] cursor-pointer bg-background/50 border-input/60 text-xs focus:ring-1 focus:ring-indigo-500/20">
            <Award className="h-3.5 w-3.5 shrink-0 text-amber-500/80 mr-1" />
            <SelectValue placeholder="Qualification" />
          </SelectTrigger>
          <SelectContent align="end" className="text-xs">
            <SelectItem value="ALL">All Qualifications</SelectItem>
            <SelectItem value="HOT">Hot</SelectItem>
            <SelectItem value="WARM">Warm</SelectItem>
            <SelectItem value="COLD">Cold</SelectItem>
            <SelectItem value="UNSET">Unqualified</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select
          value={`${query.sortBy ?? "createdAt"}:${query.sortOrder ?? "desc"}`}
          onValueChange={(v) => {
            if (!v) return;
            const [sortBy, sortOrder] = v.split(":") as [LeadsQuery["sortBy"], LeadsQuery["sortOrder"]];
            onChange({ sortBy, sortOrder });
          }}
        >
          <SelectTrigger className="h-9 w-full sm:w-[135px] cursor-pointer bg-background/50 border-input/60 text-xs focus:ring-1 focus:ring-indigo-500/20">
            <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground mr-1" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent align="end" className="text-xs">
            {ORDER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}