import { renderHook } from "@testing-library/react";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { SavedGame } from "@/types";

const mockGames: SavedGame[] = [
  {
    id: 1,
    name: "The Legend of Zelda: Breath of the Wild",
    comment: "Aventura de mundo aberto incrível",
    image: null,
    released: "2017-03-03",
    rating: 10,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Celeste",
    comment: "Plataforma desafiante e emocionante",
    image: null,
    released: "2018-01-25",
    rating: 9,
    createdAt: "2025-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Hades",
    comment: "Roguelike com narrativa excelente",
    image: null,
    released: "2020-09-17",
    rating: 10,
    createdAt: "2025-01-03T00:00:00.000Z",
  },
];

describe("useFuzzySearch", () => {
  test("retorna todos os jogos quando query está vazia", () => {
    const { result } = renderHook(() => useFuzzySearch(mockGames, ""));

    expect(result.current).toEqual(mockGames);
  });

  test("retorna todos os jogos quando query tem menos de 2 caracteres", () => {
    const { result } = renderHook(() => useFuzzySearch(mockGames, "z"));

    expect(result.current).toEqual(mockGames);
  });

  test("filtra por nome do jogo", () => {
    const { result } = renderHook(() => useFuzzySearch(mockGames, "Celeste"));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe("Celeste");
  });

  test("filtra por conteúdo do comentário", () => {
    const { result } = renderHook(() => useFuzzySearch(mockGames, "roguelike"));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe("Hades");
  });

  test("busca fuzzy tolera typo leve", () => {
    const { result } = renderHook(() =>
      useFuzzySearch(mockGames, "Zelda Breth"),
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toContain("Zelda");
  });

  test("retorna array vazio para query sem correspondência", () => {
    const { result } = renderHook(() => useFuzzySearch(mockGames, "xylophone"));

    expect(result.current).toEqual([]);
  });
});
