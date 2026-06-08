"use client";

import { useState, FC } from "react";
import Image from "next/image";
import type { GameCardProps } from "@/types";

/**
 * Card para exibir informações de um jogo
 */
const GameCard: FC<GameCardProps> = ({ game, onDelete, onUpdateRating }) => {
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
  const handleSave = (): void => {
    onUpdateRating(game.id, tempRating, tempComment);
    setIsEditing(false);
  };

  /**
   * Cancela edição e restaura valores originais
   */
  const handleCancel = (): void => {
    setTempRating(game.rating);
    setTempComment(game.comment);
    setIsEditing(false);
  };

  const handleImageError = (): void => {
    setImageSrc("https://via.placeholder.com/300x400?text=Sem+Capa");
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10) || 0;
    setTempRating(Math.max(0, Math.min(10, value)));
  };

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setTempComment(e.target.value);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Imagem do Jogo */}
      <div className="relative w-full h-64 bg-gray-700 overflow-hidden">
        <Image
          src={imageSrc}
          alt={game.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          onError={handleImageError}
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
                onChange={handleRatingChange}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-3"
              />

              <label className="block text-gray-300 text-sm font-bold mb-2">
                Comentário:
              </label>
              <textarea
                value={tempComment}
                onChange={handleCommentChange}
                placeholder="Adicione um comentário..."
                className="w-full bg-gray-700 text-white rounded px-3 py-2 resize-none"
                rows={3}
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
};

export default GameCard;
