/**
 * Componente exibido quando não há jogos salvos
 * Componentes sem estado podem ser funções simples
 */
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-8xl mb-4">★</div>
      <h2 className="text-3xl font-bold mb-2">Nenhum jogo adicionado</h2>
      <p className="text-gray-400 mb-8">
        Comece a adicionar seus jogos favoritos!
      </p>
      <a
        href="/add"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
      >
        Adicionar Primeiro Jogo
      </a>
    </div>
  );
}
