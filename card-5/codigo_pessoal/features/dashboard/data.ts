import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import type {
  ChartDataPoint,
  MetricCardData,
  NavItem,
  RecentSale,
} from "@/features/dashboard/types";

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Relatorios", href: "#relatorios", icon: LineChart },
  { label: "Pedidos", href: "#pedidos", icon: ShoppingCart },
  { label: "Clientes", href: "#clientes", icon: Users },
  { label: "Ajustes", href: "#ajustes", icon: Settings },
];

export const logoutItem: NavItem = {
  label: "Sair",
  href: "/auth/login",
  icon: LogOut,
};

export const metrics: MetricCardData[] = [
  {
    title: "Total Vendas",
    description: "Em 90 dias",
    value: "R$ 128.450",
    icon: DollarSign,
  },
  {
    title: "Pedidos",
    description: "Crescimento mensal",
    value: "1.284",
    icon: CreditCard,
  },
  {
    title: "Clientes Ativos",
    description: "Base recorrente",
    value: "842",
    icon: Users,
  },
  {
    title: "Produtos",
    description: "Catalogo publicado",
    value: "96",
    icon: Package,
  },
];

export const chartData: ChartDataPoint[] = [
  { month: "Janeiro", desktop: 186, mobile: 80 },
  { month: "Fevereiro", desktop: 305, mobile: 200 },
  { month: "Marco", desktop: 237, mobile: 120 },
  { month: "Abril", desktop: 73, mobile: 190 },
  { month: "Maio", desktop: 209, mobile: 130 },
  { month: "Junho", desktop: 214, mobile: 140 },
];

export const chartMeta = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--foreground))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--muted-foreground))",
  },
};

export const recentSales: RecentSale[] = [
  {
    name: "Marina Costa",
    email: "marina.costa@email.com",
    amount: "+R$ 2.450,00",
    avatarUrl: "https://github.com/shadcn.png",
    fallback: "MC",
  },
  {
    name: "Rafael Lima",
    email: "rafael.lima@email.com",
    amount: "+R$ 1.250,00",
    avatarUrl: "https://github.com/vercel.png",
    fallback: "RL",
  },
  {
    name: "Beatriz Rocha",
    email: "beatriz.rocha@email.com",
    amount: "+R$ 890,00",
    avatarUrl: "https://github.com/radix-ui.png",
    fallback: "BR",
  },
  {
    name: "Lucas Pereira",
    email: "lucas.pereira@email.com",
    amount: "+R$ 640,00",
    avatarUrl: "https://github.com/tailwindlabs.png",
    fallback: "LP",
  },
];

export const overviewIcon = BarChart3;
