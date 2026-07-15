"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { GameWithPairs } from "@/types/Game";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Answer } from "./gameController";
import { ArrowLeft } from "lucide-react";

type GameProps = {
  id: string;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  answers: Answer[];
  setAnswers: Dispatch<SetStateAction<Answer[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
};

export default function GameResults({
  id,
  setStep,
  answers,
  setAnswers,
  setIndex,
}: GameProps) {
  const [gameData, setGameData] = useState<GameWithPairs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/getFullGame/${id}`,
        );

        const json = await res.json();

        if (json.status !== "success") {
          throw new Error(json.message);
        }

        setGameData(json.data);
      } catch (err) {
        // set error state
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  function back() {
    setIndex(0);
    setAnswers([]);
    setStep("info");
  }

  return (
    <div className="flex flex-col gap-8">
      <Button
        onClick={back}
        variant="ghost"
        size="icon"
        aria-label="Back to game info"
      >
        <ArrowLeft size={24} />
      </Button>

      {loading && (
        <div className="text-center text-muted py-12">Loading results...</div>
      )}

      {!loading && !gameData && (
        <div className="text-center text-error py-12">
          Couldn&apos;t load results. Please try again.
        </div>
      )}

      {gameData?.pairs.map((pair) => {
        const userAnswer = answers.find((a) => a.pairId === pair.id);

        const leftWins = pair.leftScore > pair.rightScore;
        const rightWins = pair.rightScore > pair.leftScore;
        const pickedLeft = userAnswer?.selected === "left";
        const pickedRight = userAnswer?.selected === "right";

        return (
          <Card key={pair.id} variant="surface1" radius="2xl" padding="lg">
            <div className="text-center text-sm text-muted mb-4">
              Battle Result
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* LEFT */}
              <div className="flex flex-col items-center flex-1">
                <h3 className="text-lg font-semibold mb-2 text-center text-text1">
                  {pair.leftName}
                </h3>

                <div className="relative w-28 h-28 md:w-40 md:h-40">
                  <Image
                    src={pair.leftImage || "/placeholder-card.png"}
                    alt={pair.leftName}
                    fill
                    sizes="256px"
                    className={`object-cover rounded-xl border-4 transition-colors ${
                      pickedLeft
                        ? "border-main1 shadow-glow-main1"
                        : "border-transparent"
                    }`}
                  />
                </div>

                <div className="mt-3 text-2xl font-bold text-main1">
                  {pair.leftScore}
                </div>

                <div
                  className={`text-sm mt-1 ${
                    leftWins ? "text-success font-semibold" : "text-muted"
                  }`}
                >
                  {leftWins ? "Winner" : " "}
                </div>
              </div>

              <span className="text-sm md:text-base font-black tracking-wide text-text1 shrink-0">
                VS
              </span>

              {/* RIGHT */}
              <div className="flex flex-col items-center flex-1">
                <h3 className="text-lg font-semibold mb-2 text-center text-text1">
                  {pair.rightName}
                </h3>

                <div className="relative w-28 h-28 md:w-40 md:h-40">
                  <Image
                    src={pair.rightImage || "/placeholder-card.png"}
                    alt={pair.rightName}
                    fill
                    sizes="256px"
                    className={`object-cover rounded-xl border-4 transition-colors ${
                      pickedRight
                        ? "border-main2 shadow-glow-main2"
                        : "border-transparent"
                    }`}
                  />
                </div>

                <div className="mt-3 text-2xl font-bold text-main2">
                  {pair.rightScore}
                </div>

                <div
                  className={`text-sm mt-1 ${
                    rightWins ? "text-success font-semibold" : "text-muted"
                  }`}
                >
                  {rightWins ? "Winner" : " "}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
