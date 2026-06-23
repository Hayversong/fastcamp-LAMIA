import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface MetricCardData {
  title: string;
  description: string;
  value: string;
  icon: LucideIcon;
}

export interface ChartDataPoint {
  month: string;
  desktop: number;
  mobile: number;
}

export interface RecentSale {
  name: string;
  email: string;
  amount: string;
  avatarUrl: string;
  fallback: string;
}
