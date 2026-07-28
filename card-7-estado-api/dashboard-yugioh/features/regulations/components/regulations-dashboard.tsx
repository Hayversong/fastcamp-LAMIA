"use client";

import { CalendarDays, Database, Layers3, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState } from "@/components/loading-state";
import { formatDate } from "@/lib/format";
import { GAME_MODE_LABELS } from "../constants";
import { useRegulationsDashboard } from "../hooks/use-regulations-dashboard";
import type { GameMode } from "../types";
import { RegulationTable } from "./regulation-table";

export function RegulationsDashboard() {
  const { gameMode, setGameMode, query, filters } = useRegulationsDashboard();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
        <div className="max-w-4xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Lista de proibidas & limitadas
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:whitespace-nowrap lg:text-6xl">
            Regulamentação Yu-Gi-Oh!
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Consulte as restrições atuais das principais modalidades e encontre cartas por ID.
          </p>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Modalidade</span>
          <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
            <SelectTrigger className="h-11" aria-label="Selecionar modalidade"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="master-duel">Master Duel</SelectItem>
              <SelectItem value="tcg">TCG</SelectItem>
              <SelectItem value="ocg">OCG</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </section>

      {query.isPending ? <LoadingState /> : null}

      {query.isError ? (
        <Card className="border-destructive/40">
          <CardContent className="flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center">
            <div className="rounded-full bg-destructive/10 p-3 text-red-300">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Não foi possível carregar a regulamentação</p>
              <p className="mt-1 text-sm text-muted-foreground">{query.error.message}</p>
            </div>
            <Button onClick={() => query.refetch()}>
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {query.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3" aria-label="Resumo da regulamentação">
            <MetricCard icon={Layers3} label="Modalidade" value={GAME_MODE_LABELS[gameMode]} description="Lista competitiva selecionada" />
            <MetricCard icon={CalendarDays} label="Em vigor desde" value={formatDate(query.data.date)} description="Data efetiva da regulamentação" />
            <MetricCard icon={Database} label="Cartas regulamentadas" value={String(query.data.cards.length)} description="Total de IDs com restrição" />
          </section>

          <RegulationTable
            cards={filters.paginatedCards}
            resultCount={filters.filteredCards.length}
            totalCount={query.data.cards.length}
            search={filters.search}
            status={filters.status}
            page={filters.page}
            totalPages={filters.totalPages}
            onSearchChange={filters.setSearch}
            onStatusChange={filters.setStatus}
            onPreviousPage={filters.previousPage}
            onNextPage={filters.nextPage}
          />
        </div>
      ) : null}
    </div>
  );
}

interface MetricCardProps {
  icon: typeof Layers3;
  label: string;
  value: string;
  description: string;
}

function MetricCard({ icon: Icon, label, value, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
