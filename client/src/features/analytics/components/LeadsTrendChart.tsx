import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { LeadsTimeseriesPoint } from "../types";

const chartConfig = {
  totalLeads: { label: "Total Leads", color: "var(--chart-1)" },
  convertedLeads: { label: "Converted", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function LeadsTrendChart({ data }: { data: LeadsTimeseriesPoint[] }) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">Not enough data yet for this period.</div>;
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => format(parseISO(v), "MMM d")} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => format(parseISO(v as string), "PPP")} />} />
        <Line dataKey="totalLeads" type="monotone" stroke="var(--color-totalLeads)" strokeWidth={2} dot={false} />
        <Line dataKey="convertedLeads" type="monotone" stroke="var(--color-convertedLeads)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  );
}