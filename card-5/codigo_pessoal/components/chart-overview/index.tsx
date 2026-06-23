"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { chartData, chartMeta } from "@/components/dashboard-data";
import { formatMonthLabel } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export function ChartOverview() {
  return (
    <Card className="w-full md:basis-1/2">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Comparativo por canal nos ultimos meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartMeta} className="min-h-[260px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatMonthLabel}
            />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
