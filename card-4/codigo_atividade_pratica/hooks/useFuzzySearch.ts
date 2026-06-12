import { useMemo } from "react";
import Fuse from "fuse.js";
import type { SavedGame } from "@/types";

const FUSE_OPTIONS = {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "comment", weight: 0.3 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
};

export function useFuzzySearch(games: SavedGame[], query: string): SavedGame[] {
  const fuse = useMemo(() => new Fuse(games, FUSE_OPTIONS), [games]);

  return useMemo(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      return games;
    }

    return fuse.search(trimmed).map((result) => result.item);
  }, [fuse, games, query]);
}
