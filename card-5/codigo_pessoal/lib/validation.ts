import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import type { ValidationResult } from "@/types/api";

export const NavItemSchema = z.object({
  label: z.string().min(1, "Label e obrigatorio"),
  href: z.string().min(1, "Href e obrigatorio"),
  icon: z.custom<LucideIcon>(
    (value) => typeof value === "function" || typeof value === "object",
    "Icone invalido",
  ),
});

export const MetricCardDataSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio"),
  description: z.string().min(1, "Descricao e obrigatoria"),
  value: z.string().min(1, "Valor e obrigatorio"),
  icon: NavItemSchema.shape.icon,
});

export const ChartDataPointSchema = z.object({
  month: z.string().min(1, "Mes e obrigatorio"),
  desktop: z.number().int().nonnegative(),
  mobile: z.number().int().nonnegative(),
});

export const RecentSaleSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  email: z.string().email("E-mail invalido"),
  amount: z.string().min(1, "Valor e obrigatorio"),
  avatarUrl: z.string().url("Avatar invalido"),
  fallback: z.string().min(1).max(3),
});

export const SignInSchema = z.object({
  email: z.string().email("Informe um e-mail valido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const SaleFormSchema = z.object({
  name: z.string().min(2, "Informe o nome do cliente"),
  email: z.string().email("Informe um e-mail valido"),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
});

export const MetricFormSchema = z.object({
  title: z.string().min(2, "Informe o titulo"),
  description: z.string().min(2, "Informe a descricao"),
  value: z.string().min(1, "Informe o valor"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
export type SaleFormInput = z.infer<typeof SaleFormSchema>;
export type MetricFormInput = z.infer<typeof MetricFormSchema>;

export type NavItem = z.infer<typeof NavItemSchema>;
export type MetricCardData = z.infer<typeof MetricCardDataSchema>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
export type RecentSale = z.infer<typeof RecentSaleSchema>;

export function validateData<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: result.error.issues[0]?.message ?? "Dados invalidos",
  };
}
