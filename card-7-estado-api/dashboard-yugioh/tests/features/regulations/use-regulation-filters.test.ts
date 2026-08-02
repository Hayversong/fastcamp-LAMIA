import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRegulationFilters } from "@/features/regulations/hooks/use-regulation-filters";
import type { RegulationCard } from "@/features/regulations/types";

const cards: RegulationCard[] = [
  { cardId: "4023", limit: 1 },
  { cardId: "4095", limit: 0 },
  { cardId: "6075", limit: 2 },
];

describe("useRegulationFilters", () => {
  it("filtra por ID", () => {
    const { result } = renderHook(() => useRegulationFilters(cards));

    act(() => result.current.setSearch("4095"));

    expect(result.current.filteredCards).toEqual([
      { cardId: "4095", limit: 0 },
    ]);
  });

  it("filtra por status", () => {
    const { result } = renderHook(() => useRegulationFilters(cards));

    act(() => result.current.setStatus("2"));

    expect(result.current.filteredCards).toEqual([
      { cardId: "6075", limit: 2 },
    ]);
  });
});
