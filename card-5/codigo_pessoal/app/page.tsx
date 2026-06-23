import { AnalyticsOverview } from "@/components/analytics-overview";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricsGrid } from "@/components/metrics-grid";

export default function HomePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <section className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Visao geral
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard comercial
          </h1>
        </section>
        <MetricsGrid />
        <AnalyticsOverview />
      </div>
    </DashboardShell>
  );
}
