import { ChartOverview } from "@/features/dashboard/components/chart-overview";
import { SalesFeed } from "@/features/dashboard/components/sales-feed";

export function AnalyticsOverview() {
  return (
    <section
      aria-label="Dados analiticos"
      className="flex flex-col gap-4 md:flex-row"
    >
      <ChartOverview />
      <SalesFeed />
    </section>
  );
}
