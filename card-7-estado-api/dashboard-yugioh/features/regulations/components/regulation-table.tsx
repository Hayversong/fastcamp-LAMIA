"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { LIMIT_LABELS } from "../constants";
import type { RegulationCard, RegulationLimit, StatusFilter } from "../types";

interface RegulationTableProps {
  cards: RegulationCard[];
  resultCount: number;
  totalCount: number;
  search: string;
  status: StatusFilter;
  page: number;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const statusClasses: Record<RegulationLimit, string> = {
  0: "border-red-500/25 bg-red-500/10 text-red-300",
  1: "border-amber-500/25 bg-amber-500/10 text-amber-300",
  2: "border-sky-500/25 bg-sky-500/10 text-sky-300",
};

export function RegulationTable({
  cards,
  resultCount,
  totalCount,
  search,
  status,
  page,
  totalPages,
  onSearchChange,
  onStatusChange,
  onPreviousPage,
  onNextPage,
}: RegulationTableProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-5 border-b lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <CardTitle>Lista de regulamentação</CardTitle>
          <CardDescription>
            {resultCount} de {totalCount} cartas encontradas
          </CardDescription>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px]">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Pesquisar por ID</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={search}
                placeholder="Ex.: 4023"
                className="pl-9"
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Status</span>
            <Select value={status} onValueChange={(value) => onStatusChange(value as StatusFilter)}>
              <SelectTrigger aria-label="Filtrar por status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="0">Proibidas</SelectItem>
                <SelectItem value="1">Limitadas</SelectItem>
                <SelectItem value="2">Semilimitadas</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
      </CardHeader>

      {resultCount === 0 ? (
        <CardContent className="p-6"><EmptyState /></CardContent>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>ID da carta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cópias permitidas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.cardId}>
                  <TableCell className="font-mono font-medium">#{card.cardId}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(statusClasses[card.limit])}>
                      {LIMIT_LABELS[card.limit]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{card.limit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row sm:px-6">
            <p className="text-sm text-muted-foreground">
              Página <strong className="text-foreground">{page}</strong> de{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </p>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none" disabled={page === 1} onClick={onPreviousPage}>
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none" disabled={page === totalPages} onClick={onNextPage}>
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
