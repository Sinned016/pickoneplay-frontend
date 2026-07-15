"use client";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { updatePairScore } from "@/services/games";
import { GameWithPairs, Pair } from "@/types/Game";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { Answer } from "./gameController";

type GameProps = {
  game: GameWithPairs;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  answers: Answer[];
  setAnswers: Dispatch<SetStateAction<Answer[]>>;
};

type ChoiceTileProps = {
  name: string;
  image: string | null;
  side: "left" | "right";
  isSelected: boolean;
  isDimmed: boolean;
  onChoose: () => void;
};

const sideSelectedClasses: Record<"left" | "right", string> = {
  left: "ring-2 ring-main1 shadow-glow-main1",
  right: "ring-2 ring-main2 shadow-glow-main2",
};

const HOLD_MS = 350;
const EXIT_MS = 220;

const sideTextClasses: Record<"left" | "right", string> = {
  left: "text-main1",
  right: "text-main2",
};

function ChoiceTile({
  name,
  image,
  side,
  isSelected,
  isDimmed,
  onChoose,
}: ChoiceTileProps) {
  return (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <h3
        className={cn(
          "text-center text-xl md:text-3xl mb-2 transition-colors duration-200",
          isSelected ? sideTextClasses[side] : "text-text1",
        )}
      >
        {name}
      </h3>

      <button
        onClick={onChoose}
        disabled={isSelected || isDimmed}
        className={cn(
          "relative w-32 h-32 md:w-64 md:h-64 rounded-xl border border-border1 overflow-hidden cursor-pointer transition-all duration-200",
          "hover:scale-[1.02] hover:border-border1-strong active:scale-[0.98]",
          isSelected && sideSelectedClasses[side],
          isDimmed && "opacity-50 pointer-events-none",
        )}
      >
        <Image
          src={image || "/placeholder-card.png"}
          alt={name}
          fill
          sizes="256px"
          className="object-cover"
        />
      </button>
    </div>
  );
}

export default function GameSession({
  game,
  setStep,
  index,
  setIndex,
  answers,
  setAnswers,
}: GameProps) {
  const pair: Pair = game.pairs[index];
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(
    null,
  );
  const [isExiting, setIsExiting] = useState(false);

  async function choose(pairId: string, name: string, side: "left" | "right") {
    setSelectedSide(side);

    setAnswers((prev) => [
      ...prev,
      {
        pairId,
        selected: side,
        name,
      },
    ]);

    const dataToSend = {
      pairId,
      name,
      side,
    };

    // update score
    await updatePairScore(dataToSend);

    // Set error state if it goes wrong.

    // Hold briefly so the selection is visible, then animate out.
    await new Promise((resolve) => setTimeout(resolve, HOLD_MS));
    setIsExiting(true);
    await new Promise((resolve) => setTimeout(resolve, EXIT_MS));

    // Go to next slide
    const nextIndex = index + 1;

    if (nextIndex >= game.pairs.length) {
      // Finish game and go to results
      setStep("results");
    } else {
      setIndex(nextIndex);
      setSelectedSide(null);
      setIsExiting(false);
    }
  }

  function back() {
    setIndex(0);
    setAnswers([]);
    setStep("info");
  }

  return (
    <div>
      <Button
        onClick={back}
        variant="ghost"
        size="icon"
        aria-label="Back to game info"
      >
        <ArrowLeft size={24} />
      </Button>

      <div className="flex items-center justify-center gap-4 mb-24 mt-12">
        <h2 className="text-3xl md:text-5xl text-center text-text1">
          Would you rather
        </h2>
      </div>

      <div
        key={index}
        className={cn(
          "flex flex-col md:flex-row items-center justify-between gap-6",
          isExiting ? "pair-exit" : "pair-enter",
        )}
      >
        <ChoiceTile
          name={pair.leftName}
          image={pair.leftImage}
          side="left"
          isSelected={selectedSide === "left"}
          isDimmed={selectedSide !== null && selectedSide !== "left"}
          onChoose={() => choose(pair.id, pair.leftName, "left")}
        />

        <span className="text-sm md:text-base font-black tracking-wide text-text1 shrink-0">
          VS
        </span>

        <ChoiceTile
          name={pair.rightName}
          image={pair.rightImage}
          side="right"
          isSelected={selectedSide === "right"}
          isDimmed={selectedSide !== null && selectedSide !== "right"}
          onChoose={() => choose(pair.id, pair.rightName, "right")}
        />
      </div>
    </div>
  );
}
