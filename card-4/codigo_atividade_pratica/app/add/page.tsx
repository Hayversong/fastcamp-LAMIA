"use client";

import { FC } from "react";
import { useAddGame } from "@/hooks";
import GameForm from "@/components/GameForm";

const AddGamePage: FC = () => {
  const { isLoading, error, handleSubmit } = useAddGame();

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Adicionar Novo Jogo</h2>
      <GameForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitError={error}
      />
    </div>
  );
};

export default AddGamePage;
