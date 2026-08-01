import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, SlidersHorizontal, Award, ArrowUpDown, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ORDER_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "createdAt:asc", label: "Oldest" },
  { value: "name:asc", label: "A - Z" },
  { value: "name:desc", label: "Z - A" },
];

export function HeaderSearchFilter() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [qualification, setQualification] = useState("");
  const [order, setOrder] = useState("createdAt:desc");

  const activeFilterCount = [status, qualification].filter(Boolean).length;

  function runSearch() {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (qualification) params.set("qualification", qualification);
    const [sortBy, sortOrder] = order.split(":");
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    navigate(`/leads?${params.toString()}`);
    setOpen(false);
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setQualification("");
    setOrder("createdAt:desc");
    navigate("/leads");
    setOpen(false);
  }

  return (
    <div
      className={`flex min-w-0 max-w-md flex-1 items-center rounded-lg bg-background/80 ${
        open ? "ring-1 ring-ring shadow-lg" : "focus-within:ring-1 focus-within:ring-ring"
      }`}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              className="h-9 shrink-0 gap-2 rounded-l-lg border-r border-border/20 px-3 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-0"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="h-3 w-3 opacity-50 transition-transform duration-200" />
            </Button>
          }
        />

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
               Filter & Sort
            </span>
            {activeFilterCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <Accordion className="w-full">
            {/* Status Item */}
            <AccordionItem value="status" className="border-border">
              <AccordionTrigger className="py-2.5 text-xs font-medium text-foreground hover:no-underline hover:bg-accent/50 px-2 rounded-md transition-colors">
                <span className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" /> Status
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1">
                <ToggleGroup
                  value={status ? [status] : []}
                  onValueChange={(next: string[]) => {
                    const selected = next[0] ?? "";
                    setStatus((prev) => (prev === selected ? "" : selected));
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  {[
                    { value: "NEW", label: "New" },
                    { value: "CONTACTED", label: "Contacted" },
                    { value: "CONVERTED", label: "Converted" },
                    { value: "LOST", label: "Lost" },
                  ].map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      className="h-7 text-xs rounded-md bg-muted/50 border border-border text-foreground font-medium transition-colors hover:!bg-accent hover:!text-accent-foreground data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground data-[state=on]:hover:!bg-primary/90 cursor-pointer"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </AccordionContent>
            </AccordionItem>

            {/* Qualification Item */}
            <AccordionItem value="qualification" className="border-border">
              <AccordionTrigger className="py-2.5 text-xs font-medium text-foreground hover:no-underline hover:bg-accent/50 px-2 rounded-md transition-colors">
                <span className="flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-muted-foreground" /> Qualification
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1">
                <ToggleGroup
                  value={qualification ? [qualification] : []}
                  onValueChange={(next: string[]) => {
                    const selected = next[0] ?? "";
                    setQualification((prev) => (prev === selected ? "" : selected));
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  {[
                    { value: "HOT", label: "Hot" },
                    { value: "WARM", label: "Warm" },
                    { value: "COLD", label: "Cold" },
                    { value: "UNSET", label: "Unqualified" },
                  ].map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      className="h-7 text-xs rounded-md bg-muted/50 border border-border text-foreground font-medium transition-colors hover:!bg-accent hover:!text-accent-foreground data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground data-[state=on]:hover:!bg-primary/90 cursor-pointer"
                    >
                      {item.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </AccordionContent>
            </AccordionItem>

            {/* Sort Order Item */}
            <AccordionItem value="order" className="border-b-0">
              <AccordionTrigger className="py-2.5 text-xs font-medium text-foreground hover:no-underline hover:bg-accent/50 px-2 rounded-md transition-colors">
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" /> Sort Order
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2 pt-1">
                <ToggleGroup
                  value={order ? [order] : ["createdAt:desc"]}
                  onValueChange={(next: string[]) => {
                    const selected = next[0] ?? "createdAt:desc";
                    setOrder((prev) => (prev === selected && selected !== "createdAt:desc" ? "createdAt:desc" : selected));
                  }}
                  className="grid grid-cols-2 gap-1.5"
                >
                  {ORDER_OPTIONS.map((opt) => (
                    <ToggleGroupItem
                      key={opt.value}
                      value={opt.value}
                      className="h-7 text-xs rounded-md bg-muted/50 border border-border text-foreground font-medium transition-colors hover:!bg-accent hover:!text-accent-foreground data-[state=on]:!bg-primary data-[state=on]:!text-primary-foreground data-[state=on]:hover:!bg-primary/90 cursor-pointer"
                    >
                      {opt.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            size="sm"
            className="w-full mt-3 h-8 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            onClick={runSearch}
          >
            Apply Filters
          </Button>
        </PopoverContent>
      </Popover>

      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          className="h-9 border-0 pl-8 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {(search || status || qualification || order !== "createdAt:desc") && (
          <Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={resetFilters}
  className={`absolute right-1 top-1 h-7 w-7 transition-opacity duration-200 hover:bg-muted ${
    search || status || qualification || order !== "createdAt:desc"
      ? "opacity-100 pointer-events-auto"
      : "opacity-0 pointer-events-none"
  }`}
  aria-label="Reset search and filters"
>
  <RotateCcw className="h-3.5 w-3.5" />
</Button>
        )}
      </div>
    </div>
  );
}