/**
 * Skeleton exibido enquanto os jogos ainda estão sendo carregados do localStorage
 * Evita o flash de "Nenhum jogo adicionado" antes da hidratação
 */
import type { ReactNode } from "react";

export default function LoadingState(): ReactNode {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-700 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
