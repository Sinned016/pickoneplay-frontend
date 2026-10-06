import GameCard from "@/components/ui/GameCard";
import { Game } from "@/types/Game";

type Props = {
  games: Game[];
};

export default function RecommendedGames({ games }: Props) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl text-text1 font-semibold mb-6">
        You might also like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ))}
      </div>
    </div>
  );
}
