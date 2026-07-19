import { AuthGuard } from "@/features/auth/components/auth-guard";
import { AnalyticsOverview } from "@/features/dashboard/components/analytics-overview";
import { DashboardForms } from "@/features/dashboard/components/dashboard-forms";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { MetricsGrid } from "@/features/dashboard/components/metrics-grid";

export default function HomePage() {
  return (
    <AuthGuard>
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
          <DashboardForms />
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
