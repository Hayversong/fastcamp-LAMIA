import { describe, expect, it } from "vitest";
import { Home } from "lucide-react";
import {
  ChartDataPointSchema,
  MetricCardDataSchema,
  MetricFormSchema,
  RecentSaleSchema,
  SaleFormSchema,
  validateData,
} from "@/lib/validation";

describe("validateData", () => {
  it("returns parsed data when schema validation succeeds", () => {
    const result = validateData(
      { month: "Janeiro", desktop: 120, mobile: 80 },
      ChartDataPointSchema,
    );

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.desktop).toBe(120);
    }
  });

  it("returns the first friendly error when schema validation fails", () => {
    const result = validateData(
      {
        name: "Cliente",
        email: "email-invalido",
        amount: "+R$ 100,00",
        avatarUrl: "https://example.com/avatar.png",
        fallback: "CL",
      },
      RecentSaleSchema,
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("E-mail invalido");
    }
  });

  it("accepts lucide icons as metric component values", () => {
    const result = validateData(
      {
        title: "Total Vendas",
        description: "Em 90 dias",
        value: "R$ 128.450",
        icon: Home,
      },
      MetricCardDataSchema,
    );

    expect(result.success).toBe(true);
  });

  it("derives the sale form validation from the recent sale schema", () => {
    const result = SaleFormSchema.safeParse({
      name: "Cliente",
      email: "cliente@example.com",
      amount: "125.50",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(125.5);
    }
  });

  it("derives the metric form validation from the metric card schema", () => {
    expect(
      MetricFormSchema.safeParse({
        title: "Conversao",
        description: "Ultimos 30 dias",
        value: "4,2%",
      }).success,
    ).toBe(true);
  });
});
