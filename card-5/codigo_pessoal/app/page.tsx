"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnalyticsOverview } from "@/components/analytics-overview";
import { DashboardForms } from "@/components/dashboard-forms";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricsGrid } from "@/components/metrics-grid";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function HomePage() {
  const { hydrated, userEmail, hydrateSession } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (hydrated && !userEmail) {
      router.replace("/auth/login");
    }
  }, [hydrated, router, userEmail]);

  if (!hydrated) return <main className="min-h-screen bg-muted/40" aria-label="Carregando" />;
  if (!userEmail) return <main className="min-h-screen bg-muted/40" aria-label="Redirecionando para o login" />;

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
        <DashboardForms />
      </div>
    </DashboardShell>
  );
}
