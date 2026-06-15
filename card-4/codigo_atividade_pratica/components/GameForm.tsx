"use client";

import { FC } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGameSearch } from "@/hooks";
import { formatDateToBrazilian } from "@/lib/format";
import { GameFormInputSchema } from "@/lib/validation";
import type { GameData, GameFormInput, GameFormProps } from "@/types";

/**
 * Formulário para adicionar um novo jogo
 * Componentes reutilizáveis recebem callbacks do pai para ações
 */
const GameForm: FC<GameFormProps> = ({ onSubmit, isLoading, submitError }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GameFormInput>({
    resolver: zodResolver(GameFormInputSchema),
    defaultValues: {
      gameName: "",
      rating: 5,
      comment: "",
    },
  });

  const gameName = watch("gameName");

  // Custom hook para gerenciar busca de jogos
  const { searchedGame, isSearching, error, search, clearSearch } =
    useGameSearch();

  const gameNameField = register("gameName", {
    onChange: () => clearSearch(),
  });

  /**
   * Busca o jogo na API RAWG
   * Valida inputs antes de fazer requisições
   */
  const handleSearch = async (): Promise<void> => {
    await search(gameName);
  };

  /**
   * Envia o formulário com os dados do jogo
   * Valida que o jogo foi encontrado antes de enviar
   */
  const onFormSubmit = (data: GameFormInput): void => {
    if (!searchedGame) {
      return;
    }

    const formData: GameData = {
      name: searchedGame.name,
      image: searchedGame.image,
      released: searchedGame.released,
      rating: data.rating,
      comment: data.comment.trim(),
    };

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
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
            {...gameNameField}
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
        {errors.gameName && (
          <p className="text-red-400 text-sm mt-2">{errors.gameName.message}</p>
        )}
      </div>

      {/* Informações do jogo encontrado */}
      {searchedGame && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <p className="text-gray-300 mb-2">
            <strong>Jogo encontrado:</strong> {searchedGame.name}
          </p>
          {searchedGame.released && (
            <p className="text-gray-400 text-sm">
              {formatDateToBrazilian(searchedGame.released)}
            </p>
          )}
          {searchedGame.image && (
            <div className="relative w-24 h-32 mt-2 overflow-hidden rounded">
              <Image
                src={searchedGame.image}
                alt={searchedGame.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Exibir erro se houver */}
      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>
      )}

      {submitError && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">
          {submitError}
        </div>
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
          {...register("rating", { valueAsNumber: true })}
          className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.rating && (
          <p className="text-red-400 text-sm mt-2">{errors.rating.message}</p>
        )}
      </div>

      {/* Campo: Comentário */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-gray-300 font-bold mb-2">
          Comentário
        </label>
        <textarea
          id="comment"
          {...register("comment")}
          placeholder="O que você achou do jogo?"
          className="w-full bg-gray-700 text-white rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        {errors.comment && (
          <p className="text-red-400 text-sm mt-2">{errors.comment.message}</p>
        )}
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
