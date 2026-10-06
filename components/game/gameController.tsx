"use client";

import { Game, GameWithPairs } from "@/types/Game";
import { useImagePreload } from "@/hooks/useImagePreload";
import { useEffect, useMemo, useState } from "react";
import GameInfo from "./gameInfo";
import GameLoader from "./gameLoader";
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

  // Start loading every round's images as soon as the info page shows, so the
  // session never paints a half-loaded image.
  const pairImages = useMemo(
    () =>
      game.pairs.flatMap((pair) => [
        pair.leftImage || "/placeholder-card.png",
        pair.rightImage || "/placeholder-card.png",
      ]),
    [game.pairs],
  );
  const preload = useImagePreload(pairImages);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

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
          preload={preload}
        />
      )}

      {step === "session" && !preload.done && (
        <GameLoader loaded={preload.loaded} total={preload.total} />
      )}

      {step === "session" && preload.done && (
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
