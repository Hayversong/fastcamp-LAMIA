// Serviço para buscar e gerenciar jogos

/**
 * Busca jogos na API RAWG através da rota API do Next.js
 * Utiliza localStorage para cache local de buscas já realizadas
 * @param {string} gameName - Nome do jogo a buscar
 * @returns {Promise<Object>} Objeto com dados do jogo (nome, capa, etc)
 */
export async function searchGame(gameName) {
  try {
    // Verifica se está no navegador e se o jogo já foi buscado
    if (typeof window !== "undefined") {
      const cachedGames = localStorage.getItem("gamesCache");
      if (cachedGames) {
        const gamesCache = JSON.parse(cachedGames);
        if (gamesCache[gameName]) {
          return gamesCache[gameName];
        }
      }
    }

    // Chama a rota API Next.js em vez de chamar a API RAWG diretamente
    const response = await fetch(
      `/api/games?search=${encodeURIComponent(gameName)}`,
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar jogo: ${response.status}`);
    }

    const gameData = await response.json();

    if (gameData && typeof window !== "undefined") {
      // Salva no cache local
      const cachedGames = localStorage.getItem("gamesCache") || "{}";
      const gamesCache = JSON.parse(cachedGames);
      gamesCache[gameName] = gameData;
      localStorage.setItem("gamesCache", JSON.stringify(gamesCache));
    }

    return gameData;
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return null;
  }
}

/**
 * Adiciona um novo jogo ao localStorage
 * @param {Object} formData - Dados do jogo (name, rating, comment, etc)
 * @returns {Object} Jogo adicionado com id e createdAt
 */
export function addGame(formData) {
  if (typeof window === "undefined") {
    throw new Error("addGame deve ser chamado no navegador");
  }

  const savedGames = localStorage.getItem("gamesReview") || "[]";
  const games = JSON.parse(savedGames);

  const newGame = {
    ...formData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  games.push(newGame);
  localStorage.setItem("gamesReview", JSON.stringify(games));

  return newGame;
}
