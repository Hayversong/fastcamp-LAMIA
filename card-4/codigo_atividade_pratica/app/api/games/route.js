// Rota API para buscar jogos na RAWG
// Evita problemas de CORS fazendo a requisição no servidor
import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameName = searchParams.get("search");

    if (!gameName) {
      return Response.json(
        { error: "Parâmetro 'search' é obrigatório" },
        { status: 400 },
      );
    }

    const API_KEY = process.env.RAWG_API_KEY;
    const BASE_URL = process.env.RAWG_BASE_URL || "https://api.rawg.io/api";

    if (!API_KEY) {
      return Response.json(
        { error: "API_KEY não configurada" },
        { status: 500 },
      );
    }

    const url = `${BASE_URL}/games?key=${API_KEY}&search=${gameName}&page_size=1`;
    console.log("Fazendo requisição para RAWG:", url);

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "NextJS-App/1.0",
      },
    });

    console.log("Resposta da RAWG:", response.status);

    const data = response.data;
    console.log("Dados recebidos da RAWG:", data);

    if (data.results && data.results.length > 0) {
      const game = data.results[0];
      return Response.json({
        name: game.name,
        image: game.background_image,
        released: game.released,
        rating: game.rating,
      });
    }

    return Response.json(null);
  } catch (error) {
    console.error("Erro na rota API:", error.message);
    return Response.json(
      { error: "Erro ao buscar jogo: " + error.message },
      { status: 500 },
    );
  }
}
