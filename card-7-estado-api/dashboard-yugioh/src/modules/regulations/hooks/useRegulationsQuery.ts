import { useQuery } from "@tanstack/react-query";
import { RegulationService } from "../services/regulationService";

export function useRegulationsQuery() {
  return useQuery({
    queryKey: ["regulations", "master-duel", "current"],
    queryFn: RegulationService.getCurrentMasterDuel,
  });
}
