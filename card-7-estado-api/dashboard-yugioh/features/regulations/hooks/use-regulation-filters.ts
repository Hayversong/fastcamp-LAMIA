"use client";

import { useMemo, useState } from "react";
import { CARDS_PER_PAGE } from "../constants";
import type { RegulationCard, StatusFilter } from "../types";

export function useRegulationFilters(cards: RegulationCard[]) {
  const [search, setSearchState] = useState("");
  const [status, setStatusState] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch = card.cardId.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "all" || String(card.limit) === status;
      return matchesSearch && matchesStatus;
    });
  }, [cards, search, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / CARDS_PER_PAGE),
  );
  const firstIndex = (page - 1) * CARDS_PER_PAGE;
  const paginatedCards = filteredCards.slice(
    firstIndex,
    firstIndex + CARDS_PER_PAGE,
  );

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  function setStatus(value: StatusFilter) {
    setStatusState(value);
    setPage(1);
  }

  function previousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function nextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  function resetFilters() {
    setSearchState("");
    setStatusState("all");
    setPage(1);
  }

  return {
    search,
    status,
    page,
    totalPages,
    filteredCards,
    paginatedCards,
    setSearch,
    setStatus,
    previousPage,
    nextPage,
    resetFilters,
  };
}
