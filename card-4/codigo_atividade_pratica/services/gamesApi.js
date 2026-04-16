// Serviço para consumir a API RAWG (https://rawg.io/apidocs)
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || "dummy_key";
const BASE_URL = "https://api.rawg.io/api";

/**
 * Busca jogos na API RAWG com base no nome
 * @param {string} gameName - Nome do jogo a buscar
 * @returns {Promise<Object>} Objeto com dados do jogo (nome, capa, etc)
 * Boa prática: Funções de API isoladas e reutilizáveis
 */
export async function searchGame(gameName) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${gameName}&page_size=1`,
      { next: { revalidate: 3600 } }, // Cache por 1 hora
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar jogo na API");
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const game = data.results[0];
      return {
        name: game.name,
        image: game.background_image,
        released: game.released,
        rating: game.rating,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao consumir API RAWG:", error);
    return null;
  }
}
