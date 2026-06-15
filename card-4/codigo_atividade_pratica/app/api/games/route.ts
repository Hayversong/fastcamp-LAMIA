import { NextRequest } from "next/server";
import type { SearchedGame } from "@/types";

interface RawgGame {
  name: string;
  background_image: string | null;
  released: string | null;
  rating: number | null;
}

export async function GET(request: NextRequest): Promise<Response> {
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
    const BASE_URL = process.env.RAWG_BASE_URL;

    if (!API_KEY || !BASE_URL) {
      return Response.json(
        {
          error:
            "Variáveis de ambiente RAWG_API_KEY e RAWG_BASE_URL não configuradas",
        },
        { status: 500 },
      );
    }

    const encodedGameName = encodeURIComponent(gameName);
    const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodedGameName}&page_size=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NextJS-App/1.0",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Erro ao consultar RAWG: ${response.status}` },
        { status: 502 },
      );
    }

    const data: { results: RawgGame[] } = await response.json();

    if (data.results && data.results.length > 0) {
      const game = data.results[0];
      const searchedGame: SearchedGame = {
        name: game.name,
        image: game.background_image,
        released: game.released,
        rating: game.rating,
      };
      return Response.json(searchedGame);
    }

    return Response.json({ message: "Game not found" }, { status: 404 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";

    console.error("Erro na rota API:", errorMessage);
    return Response.json(
      { error: `Erro ao buscar jogo: ${errorMessage}` },
      { status: 500 },
    );
  }
}
