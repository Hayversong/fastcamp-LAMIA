import { ChartOverview } from "@/components/chart-overview";
import { SalesFeed } from "@/components/sales-feed";

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
