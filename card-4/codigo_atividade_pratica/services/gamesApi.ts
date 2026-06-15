import type { SearchedGame, GameData, SavedGame } from "@/types";

export async function searchGame(
  gameName: string,
): Promise<SearchedGame | null> {
  // A API interna mantém a chave RAWG no servidor e normaliza erros HTTP.
  const response = await fetch(
    `/api/games?search=${encodeURIComponent(gameName)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Erro ao buscar jogo: ${response.status}`);
  }

  const gameData: SearchedGame | null = await response.json();
  return gameData;
}

export function addGame(formData: GameData): SavedGame {
  if (typeof window === "undefined") {
    throw new Error("addGame deve ser chamado no navegador");
  }

  const savedGames = localStorage.getItem("gamesReview") || "[]";
  const games: SavedGame[] = JSON.parse(savedGames);

  const nextId =
    games.length > 0
      ? Math.max(...games.map((game) => game.id)) + 1
      : Date.now();

  const newGame: SavedGame = {
    ...formData,
    id: nextId,
    createdAt: new Date().toISOString(),
  };

  games.push(newGame);
  localStorage.setItem("gamesReview", JSON.stringify(games));

  return newGame;
}

export function getGames(): SavedGame[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedGames = localStorage.getItem("gamesReview") || "[]";
    return JSON.parse(savedGames);
  } catch (error) {
    console.error("Erro ao recuperar jogos:", error);
    return [];
  }
}

export function removeGame(id: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const savedGames = localStorage.getItem("gamesReview") || "[]";
  const games: SavedGame[] = JSON.parse(savedGames);
  const filteredGames = games.filter((game) => game.id !== id);
  localStorage.setItem("gamesReview", JSON.stringify(filteredGames));
}

export function updateGame(
  id: number,
  updates: Partial<Omit<SavedGame, "id" | "createdAt">>,
): SavedGame | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedGames = localStorage.getItem("gamesReview") || "[]";
  const games: SavedGame[] = JSON.parse(savedGames);

  const gameIndex = games.findIndex((game) => game.id === id);
  if (gameIndex === -1) {
    return null;
  }

  games[gameIndex] = { ...games[gameIndex], ...updates };
  localStorage.setItem("gamesReview", JSON.stringify(games));

  return games[gameIndex];
}
