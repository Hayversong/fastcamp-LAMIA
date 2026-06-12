import { addGame, getGames, removeGame, updateGame } from "@/services/gamesApi";
import type { GameData } from "@/types";

const mockGameData: GameData = {
  name: "Test Game",
  image: null,
  released: null,
  rating: 8,
  comment: "Great game",
};

describe("gamesApi", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("addGame", () => {
    test("retorna jogo com id e createdAt gerados", () => {
      const saved = addGame(mockGameData);

      expect(saved).toHaveProperty("id");
      expect(saved).toHaveProperty("createdAt");
      expect(saved.name).toBe(mockGameData.name);
    });

    test("persiste o jogo no localStorage", () => {
      addGame(mockGameData);

      const all = getGames();
      expect(all).toHaveLength(1);
      expect(all[0].name).toBe("Test Game");
    });

    test("acumula múltiplos jogos", () => {
      addGame(mockGameData);
      addGame({ ...mockGameData, name: "Second Game" });

      expect(getGames()).toHaveLength(2);
    });
  });

  describe("getGames", () => {
    test("retorna array vazio quando não há jogos", () => {
      expect(getGames()).toEqual([]);
    });

    test("retorna todos os jogos salvos", () => {
      addGame(mockGameData);
      addGame({ ...mockGameData, name: "Second Game" });

      expect(getGames().map((game) => game.name)).toEqual([
        "Test Game",
        "Second Game",
      ]);
    });
  });

  describe("updateGame", () => {
    test("atualiza rating e comment do jogo", () => {
      const saved = addGame(mockGameData);
      const updated = updateGame(saved.id, { rating: 9, comment: "Now great" });

      expect(updated?.rating).toBe(9);
      expect(updated?.comment).toBe("Now great");
    });

    test("retorna null para id inexistente", () => {
      const result = updateGame(999, { rating: 10 });

      expect(result).toBeNull();
    });

    test("não altera outros jogos", () => {
      const first = addGame(mockGameData);
      const second = addGame({ ...mockGameData, name: "Second Game" });

      updateGame(first.id, { rating: 10 });

      const all = getGames();
      expect(all.find((game) => game.id === first.id)?.rating).toBe(10);
      expect(all.find((game) => game.id === second.id)?.rating).toBe(8);
    });
  });

  describe("removeGame", () => {
    test("remove o jogo correto", () => {
      const saved = addGame(mockGameData);

      removeGame(saved.id);

      expect(getGames()).toHaveLength(0);
    });

    test("não remove outros jogos", () => {
      const first = addGame(mockGameData);
      const second = addGame({ ...mockGameData, name: "Second Game" });

      removeGame(first.id);

      const all = getGames();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe(second.id);
    });

    test("não lança erro ao remover id inexistente", () => {
      expect(() => removeGame(999)).not.toThrow();
    });
  });
});
