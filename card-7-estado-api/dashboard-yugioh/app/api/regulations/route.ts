import { NextRequest } from "next/server";
import {
  ExternalRegulationSchema,
  GameModeSchema,
} from "@/features/regulations/schemas";

const API_BASE_URL =
  process.env.YUGIOH_API_BASE_URL ??
  "https://dawnbrandbots.github.io/yaml-yugi-limit-regulation";

export async function GET(request: NextRequest): Promise<Response> {
  const modeResult = GameModeSchema.safeParse(
    request.nextUrl.searchParams.get("mode"),
  );

  if (!modeResult.success) {
    return Response.json(
      { error: "Modalidade inválida. Use master-duel, tcg ou ocg." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/${modeResult.data}/current.vector.json`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      return Response.json(
        { error: `Falha na API externa: ${response.status}` },
        { status: 502 },
      );
    }

    const parsed = ExternalRegulationSchema.safeParse(await response.json());

    if (!parsed.success) {
      return Response.json(
        { error: "A API externa retornou dados em formato inesperado." },
        { status: 502 },
      );
    }

    const cards = Object.entries(parsed.data.regulation).map(
      ([cardId, limit]) => ({ cardId, limit }),
    );

    return Response.json({ date: parsed.data.date, cards });
  } catch {
    return Response.json(
      { error: "Não foi possível consultar a API de regulamentações." },
      { status: 500 },
    );
  }
}
