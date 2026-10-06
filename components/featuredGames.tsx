import GameCard from "@/components/ui/GameCard";
import { Game } from "@/types/Game";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

type Props = {
  games: Game[];
};

export default function FeaturedGames({ games }: Props) {
  const newGames = [...games]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="flex items-center gap-2 text-2xl text-text1 font-semibold">
          <Sparkles className="w-6 h-6 text-main1" />
          New games
        </h2>

        <Link
          href="/games"
          className="group flex items-center gap-1 text-sm font-medium text-main1 hover:text-main1-hover"
        >
          See all
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {newGames.length === 0 ? (
        <p className="text-muted text-sm">
          No games yet — be the first to create one.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newGames.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}
