import type { SearchedGame, GameData, SavedGame } from "@/types";

/**
 * Busca jogos na API RAWG através da rota API do Next.js
 * @param gameName - Nome do jogo a buscar
 * @returns Objeto com dados do jogo (nome, capa, etc) ou null
 */
export async function searchGame(
  gameName: string,
): Promise<SearchedGame | null> {
  // Chama a rota API Next.js em vez de chamar a API RAWG diretamente
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

/**
 * Adiciona um novo jogo ao localStorage
 * @param formData - Dados do jogo (name, rating, comment, etc)
 * @returns Jogo adicionado com id e createdAt
 */
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

/**
 * Recupera todos os jogos salvos do localStorage
 * @returns Array com todos os jogos salvos
 */
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

/**
 * Remove um jogo do localStorage
 * @param id - ID do jogo a remover
 */
export function removeGame(id: number): void {
  if (typeof window === "undefined") {
    return;
  }

  const savedGames = localStorage.getItem("gamesReview") || "[]";
  const games: SavedGame[] = JSON.parse(savedGames);
  const filteredGames = games.filter((game) => game.id !== id);
  localStorage.setItem("gamesReview", JSON.stringify(filteredGames));
}

/**
 * Atualiza um jogo no localStorage
 * @param id - ID do jogo
 * @param updates - Dados a atualizar
 * @returns Jogo atualizado ou null
 */
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
