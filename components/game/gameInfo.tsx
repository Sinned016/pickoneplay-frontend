"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { updatePlayScore } from "@/services/games";
import { Game, GameWithPairs } from "@/types/Game";
import { Layers, Play as PlayIcon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import RecommendedGames from "./recommendedGames";

type GameProps = {
  game: GameWithPairs;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  recommendedGames: Game[];
};

export default function GameInfo({
  game,
  setStep,
  recommendedGames,
}: GameProps) {
  async function startGame() {
    try {
      await updatePlayScore(game.id);

      setStep("session");
    } catch (err) {
      // handle errors here
      console.error("Failed to update play score, error: ", err);
    }
  }

  return (
    <>
      <Card
        variant="surface1"
        radius="2xl"
        padding="none"
        className="overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full h-56 md:h-auto md:w-80 shrink-0">
            <Image
              src={game.image || "/placeholder-card.png"}
              alt={`${game.title} image`}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="solid" tone="main1">
                {game.category}
              </Badge>

              <span className="flex items-center gap-1.5 text-sm text-muted">
                <PlayIcon size={14} />
                {game.plays.toLocaleString()} plays
              </span>

              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Layers size={14} />
                {game.pairs.length} rounds
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-text1">
              {game.title}
            </h1>

            <p className="text-muted leading-relaxed">{game.description}</p>

            {game.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-2">
              <Button onClick={startGame} variant="primary" size="lg">
                <PlayIcon size={18} />
                Play Game
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {recommendedGames.length > 0 && (
        <RecommendedGames games={recommendedGames} />
      )}
    </>
  );
}
