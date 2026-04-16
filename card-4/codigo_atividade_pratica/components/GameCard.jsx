"use client";

import { useState } from "react";

/**
 * Card para exibir informações de um jogo
 * @param {Object} game - Dados do jogo
 * @param {Function} onDelete - Callback para deletar jogo
 * @param {Function} onUpdateRating - Callback para atualizar avaliação
 */
export default function GameCard({ game, onDelete, onUpdateRating }) {
  // Estados locais para gerenciar edição e dados temporários do card
  const [isEditing, setIsEditing] = useState(false);
  const [tempRating, setTempRating] = useState(game.rating);
  const [tempComment, setTempComment] = useState(game.comment);
  const [imageSrc, setImageSrc] = useState(
    game.image || "https://via.placeholder.com/300x400?text=Sem+Capa",
  );

  /**
   * Salva as alterações de avaliação e comentário
   * Atualiza do pai via callback em vez de estado local
   */
  const handleSave = () => {
    onUpdateRating(game.id, tempRating, tempComment);
    setIsEditing(false);
  };

  /**
   * Cancela edição e restaura valores originais
   */
  const handleCancel = () => {
    setTempRating(game.rating);
    setTempComment(game.comment);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Imagem do Jogo */}
      <div className="relative h-64 bg-gray-700 overflow-hidden">
        <img
          src={imageSrc}
          alt={game.name}
          className="w-full h-full object-cover"
          onError={() =>
            setImageSrc("https://via.placeholder.com/300x400?text=Sem+Capa")
          }
        />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-blue-400">
          {game.name}
        </h3>

        {/* Data de lançamento - Usa formato ISO para evitar hydration error */}
        {game.released && (
          <p className="text-sm text-gray-400 mb-3">
            {new Date(game.released)
              .toISOString()
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </p>
        )}

        {!isEditing ? (
          <>
            {/* Visualização */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {game.rating}
                </span>
                <span className="text-gray-400">/10</span>
              </div>

              {game.comment && (
                <p className="text-gray-300 text-sm mt-3 italic">
                  &quot;{game.comment}&quot;
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(game.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Deletar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Modo de Edição */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Nota (0-10):
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={tempRating}
                onChange={(e) =>
                  setTempRating(Math.max(0, Math.min(10, e.target.value)))
                }
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-3"
              />

              <label className="block text-gray-300 text-sm font-bold mb-2">
                Comentário:
              </label>
              <textarea
                value={tempComment}
                onChange={(e) => setTempComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="w-full bg-gray-700 text-white rounded px-3 py-2 resize-none"
                rows="3"
              />
            </div>

            {/* Botões de Salvar/Cancelar */}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
