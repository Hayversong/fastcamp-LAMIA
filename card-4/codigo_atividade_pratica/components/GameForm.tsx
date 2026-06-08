"use client";

import { useState, FC, ChangeEvent, FormEvent } from "react";
import { searchGame } from "@/services/gamesApi";
import {
  validateData,
  GameFormInputSchema,
  SearchedGameSchema,
} from "@/lib/validation";
import type { SearchedGame, GameData, GameFormProps } from "@/types";

/**
 * Formulário para adicionar um novo jogo
 * Componentes reutilizáveis recebem callbacks do pai para ações
 */
const GameForm: FC<GameFormProps> = ({ onSubmit, isLoading }) => {
  // Estados para controlar os inputs do formulário
  const [gameName, setGameName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [searchedGame, setSearchedGame] = useState<SearchedGame | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  /**
   * Busca o jogo na API RAWG
   * Valida inputs antes de fazer requisições
   */
  const handleSearch = async (): Promise<void> => {
    if (!gameName.trim()) {
      setError("Digite o nome do jogo");
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const gameData = await searchGame(gameName);

      if (gameData) {
        const gameValidation = validateData(gameData, SearchedGameSchema);
        if (gameValidation.success && gameValidation.data) {
          setSearchedGame(gameValidation.data);
        } else {
          setError(gameValidation.error || "Erro ao validar dados");
          setSearchedGame(null);
        }
      } else {
        setError("Jogo não encontrado na API RAWG. Tente outro nome.");
        setSearchedGame(null);
      }
    } catch (err) {
      console.error("Erro ao buscar jogo:", err);
      setError("Erro ao buscar jogo. Tente novamente.");
      setSearchedGame(null);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Envia o formulário com os dados do jogo
   * Valida que o jogo foi encontrado antes de enviar
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!searchedGame) {
      setError("Busque e confirme o jogo primeiro");
      return;
    }

    // Validar inputs do formulário
    const inputValidation = validateData(
      {
        gameName: searchedGame.name,
        rating: parseInt(String(rating), 10),
        comment,
      },
      GameFormInputSchema,
    );
    if (!inputValidation.success) {
      setError(inputValidation.error || "Erro ao validar dados");
      return;
    }

    const formData: GameData = {
      name: searchedGame.name,
      image: searchedGame.image,
      released: searchedGame.released,
      rating: parseInt(String(rating), 10),
      comment: comment.trim(),
    };

    onSubmit(formData);
  };

  const handleGameNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setGameName(e.target.value);
    setSearchedGame(null);
    setError("");
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRating(e.target.value as unknown as number);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setComment(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-lg p-8 shadow-lg"
    >
      {/* Campo: Nome do Jogo */}
      <div className="mb-6">
        <label
          htmlFor="gameName"
          className="block text-gray-300 font-bold mb-2"
        >
          Nome do Jogo *
        </label>
        <div className="flex gap-2">
          <input
            id="gameName"
            type="text"
            value={gameName}
            onChange={handleGameNameChange}
            placeholder="Ex: The Legend of Zelda: Breath of the Wild"
            className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSearching}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>

      {/* Informações do jogo encontrado */}
      {searchedGame && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <p className="text-gray-300 mb-2">
            <strong>Jogo encontrado:</strong> {searchedGame.name}
          </p>
          {searchedGame.released && (
            <p className="text-gray-400 text-sm">
              {new Date(searchedGame.released)
                .toISOString()
                .split("T")[0]
                .split("-")
                .reverse()
                .join("/")}
            </p>
          )}
          {searchedGame.image && (
            <img
              src={searchedGame.image}
              alt={searchedGame.name}
              className="w-24 h-32 object-cover rounded mt-2"
            />
          )}
        </div>
      )}

      {/* Exibir erro se houver */}
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>
      )}

      {/* Campo: Nota */}
      <div className="mb-6">
        <label htmlFor="rating" className="block text-gray-300 font-bold mb-2">
          Nota (0-10) *
        </label>
        <input
          id="rating"
          type="number"
          min="0"
          max="10"
          value={rating}
          onChange={handleRatingChange}
          className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Campo: Comentário */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-gray-300 font-bold mb-2">
          Comentário
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="O que você achou do jogo?"
          className="w-full bg-gray-700 text-white rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition disabled:opacity-50"
      >
        {isLoading ? "Adicionando..." : "Adicionar Jogo"}
      </button>
    </form>
  );
};

export default GameForm;
