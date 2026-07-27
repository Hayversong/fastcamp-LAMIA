import { api } from "../../../data/services/api";
import type { RegulationApiResponse, RegulationData } from "../types";

export class RegulationService {
    static async getCurrentMasterDuel(): Promise<RegulationData> {
        const response = await api.get<RegulationApiResponse>(
        "/master-duel/current.vector.json",
    );

    const cards = Object.entries(response.data.regulation).map(
        ([cardId, limit]) => ({
            cardId,
            limit,
        }),
    );

    return {
        date: response.data.date,
        cards,
    };
    }
}
