"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricFormSchema, SaleFormSchema, type MetricFormInput, type SaleFormInput } from "@/features/dashboard/schemas";
import { useDashboardStore } from "@/features/dashboard/store/dashboard-store";

const inputClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-1 text-sm font-medium">{label}{children}{error && <span className="text-xs text-destructive">{error}</span>}</label>;
}

export function DashboardForms() {
  const { addSale, saveMetric, metrics } = useDashboardStore();
  const saleForm = useForm<SaleFormInput>({ resolver: zodResolver(SaleFormSchema), defaultValues: { name: "", email: "", amount: 0 } });
  const metricForm = useForm<MetricFormInput>({ resolver: zodResolver(MetricFormSchema), defaultValues: { title: "", description: "", value: "" } });
  const title = metricForm.watch("title");
  const selectedIndex = title ? metrics.findIndex((item) => item.title === title) : -1;

  return (
    <section id="formularios" aria-label="Alimentacao de dados" className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Adicionar venda</CardTitle><CardDescription>A venda aparece imediatamente na lista de vendas recentes.</CardDescription></CardHeader>
        <CardContent><form className="grid gap-3 sm:grid-cols-2" onSubmit={saleForm.handleSubmit((data) => { addSale(data); saleForm.reset(); })} noValidate>
          <Field label="Cliente" error={saleForm.formState.errors.name?.message}><input className={inputClass} {...saleForm.register("name")} /></Field>
          <Field label="E-mail" error={saleForm.formState.errors.email?.message}><input className={inputClass} type="email" {...saleForm.register("email")} /></Field>
          <Field label="Valor (R$)" error={saleForm.formState.errors.amount?.message}><input className={inputClass} type="number" min="0.01" step="0.01" {...saleForm.register("amount")} /></Field>
          <Button className="self-end" type="submit">Adicionar venda</Button>
        </form></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Cadastrar ou editar metrica</CardTitle><CardDescription>Selecione uma metrica existente pelo titulo para atualiza-la.</CardDescription></CardHeader>
        <CardContent><form className="grid gap-3 sm:grid-cols-2" onSubmit={metricForm.handleSubmit((data) => { saveMetric(data, selectedIndex >= 0 ? selectedIndex : undefined); metricForm.reset(); })} noValidate>
          <Field label="Titulo" error={metricForm.formState.errors.title?.message}><input className={inputClass} list="metricas" {...metricForm.register("title")} /><datalist id="metricas">{metrics.map((metric) => <option key={metric.title} value={metric.title} />)}</datalist></Field>
          <Field label="Valor" error={metricForm.formState.errors.value?.message}><input className={inputClass} placeholder="Ex.: R$ 150.000" {...metricForm.register("value")} /></Field>
          <Field label="Descricao" error={metricForm.formState.errors.description?.message}><input className={inputClass} {...metricForm.register("description")} /></Field>
          <Button className="self-end" type="submit">{selectedIndex >= 0 ? "Atualizar metrica" : "Cadastrar metrica"}</Button>
        </form></CardContent>
      </Card>
    </section>
  );
}
