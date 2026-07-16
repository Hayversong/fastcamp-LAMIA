"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { AnalyticsOverview } from "@/features/dashboard/components/analytics-overview";
import { DashboardForms } from "@/features/dashboard/components/dashboard-forms";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { MetricsGrid } from "@/features/dashboard/components/metrics-grid";

export default function HomePage() {
  const { hydrated, userEmail, hydrateSession } = useAuthStore();
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
