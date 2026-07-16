"use client";

import { BarChart3 } from "lucide-react";
import { create } from "zustand";
import {
  metrics as initialMetrics,
  recentSales as initialSales,
} from "@/features/dashboard/data";
import type { MetricFormInput, SaleFormInput } from "@/features/dashboard/schemas";
import type { MetricCardData, RecentSale } from "@/features/dashboard/types";

interface DashboardStore {
  metrics: MetricCardData[];
  sales: RecentSale[];
  addSale: (sale: SaleFormInput) => void;
  saveMetric: (metric: MetricFormInput, index?: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  metrics: initialMetrics,
  sales: initialSales,

  addSale(sale) {
    const fallback = sale.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const formattedAmount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(sale.amount);

    set((state) => ({
      sales: [
        {
          name: sale.name,
          email: sale.email,
          amount: `+${formattedAmount}`,
          avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(sale.name)}`,
          fallback,
        },
        ...state.sales,
      ],
    }));
  },

  saveMetric(metric, index) {
    set((state) => {
      const nextMetric = { ...metric, icon: BarChart3 };

      if (index === undefined) {
        return { metrics: [...state.metrics, nextMetric] };
      }

      return {
        metrics: state.metrics.map((item, itemIndex) =>
          itemIndex === index ? { ...nextMetric, icon: item.icon } : item,
        ),
      };
    });
  },
}));
