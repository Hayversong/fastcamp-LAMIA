import { beforeEach, describe, expect, it } from "vitest";
import { metrics, recentSales } from "@/components/dashboard-data";
import { useDashboardStore } from "@/stores/dashboard-store";

describe("dashboard store", () => {
  beforeEach(() => {
    useDashboardStore.setState({ metrics, sales: recentSales });
  });

  it("adiciona uma venda ao inicio do feed", () => {
    useDashboardStore.getState().addSale({
      name: "Ana Souza",
      email: "ana@example.com",
      amount: 1500,
    });

    const [sale] = useDashboardStore.getState().sales;
    expect(sale).toMatchObject({
      name: "Ana Souza",
      email: "ana@example.com",
      amount: "+R$\u00a01.500,00",
      fallback: "AS",
    });
  });

  it("cadastra e edita metricas", () => {
    const store = useDashboardStore.getState();
    store.saveMetric({ title: "Conversao", description: "Ultimos 30 dias", value: "4,2%" });

    const createdIndex = useDashboardStore.getState().metrics.length - 1;
    useDashboardStore.getState().saveMetric(
      { title: "Conversao", description: "Ultimos 90 dias", value: "5,1%" },
      createdIndex,
    );

    expect(useDashboardStore.getState().metrics[createdIndex]).toMatchObject({
      title: "Conversao",
      description: "Ultimos 90 dias",
      value: "5,1%",
    });
  });
});
