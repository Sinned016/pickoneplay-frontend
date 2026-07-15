"use client";

import { Game, GameWithPairs } from "@/types/Game";
import { useState } from "react";
import GameInfo from "./gameInfo";
import GameSession from "./gameSession";
import GameResults from "./gameResults";

type GameProps = {
  game: GameWithPairs;
  recommendedGames: Game[];
};

export type Answer = {
  pairId: string;
  selected: "left" | "right";
  name: string;
};

export default function GameController({ game, recommendedGames }: GameProps) {
  // States to handle if game has started and more.
  const [step, setStep] = useState<"info" | "session" | "results">("info");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  console.log("ANSWERS: ", answers);

  function startGame() {
    setStep("session");
  }

  return (
    <>
      {step === "info" && (
        <GameInfo
          game={game}
          setStep={setStep}
          recommendedGames={recommendedGames}
        />
      )}

      {step === "session" && (
        <GameSession
          game={game}
          setStep={setStep}
          index={index}
          setIndex={setIndex}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}

      {step === "results" && (
        <GameResults
          id={game.id}
          setStep={setStep}
          setIndex={setIndex}
          answers={answers}
          setAnswers={setAnswers}
        />
      )}
    </>
  );
}
