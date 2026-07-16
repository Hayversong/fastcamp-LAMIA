"use client";

import { BarChart3 } from "lucide-react";
import { create } from "zustand";
import {
  metrics as initialMetrics,
  recentSales as initialSales,
} from "@/components/dashboard-data";
import type { MetricFormInput, SaleFormInput } from "@/lib/validation";
import type { MetricCardData, RecentSale } from "@/types";

interface DashboardStore {
  hydrated: boolean;
  userEmail: string | null;
  metrics: MetricCardData[];
  sales: RecentSale[];
  hydrateSession: () => void;
  signIn: (email: string) => void;
  signOut: () => void;
  addSale: (sale: SaleFormInput) => void;
  saveMetric: (metric: MetricFormInput, index?: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  hydrated: false,
  userEmail: null,
  metrics: initialMetrics,
  sales: initialSales,

  hydrateSession() {
    set({
      userEmail: window.localStorage.getItem("lamia-user"),
      hydrated: true,
    });
  },

  signIn(email) {
    window.localStorage.setItem("lamia-user", email);
    set({ userEmail: email });
  },

  signOut() {
    window.localStorage.removeItem("lamia-user");
    set({ userEmail: null });
  },

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
