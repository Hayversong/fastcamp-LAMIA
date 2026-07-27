export type RegulationLimit = 0 | 1 | 2;

export interface RegulationApiResponse {
    date: string;
    regulation: Record<string, RegulationLimit>;
}

export interface RegulationCard {
    cardId: string;
    limit: RegulationLimit;
}

export interface RegulationData {
    date: string;
    cards: RegulationCard[];
}
