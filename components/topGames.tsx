import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Game } from "@/types/Game";
import Image from "next/image";
import Link from "next/link";

type Props = {
  games: Game[];
};

export default function TopGames({ games }: Props) {
  const topGames = [...games].sort((a, b) => b.plays - a.plays).slice(0, 10);

  return (
    <div>
      <h2 className="flex items-center text-2xl text-text1 font-semibold mb-6">
        Top games
      </h2>

      <div className="flex flex-col gap-2">
        {topGames.map((game, index) => (
          <Link href={`/game/${game.id}`} key={game.id}>
            <Card
              key={game.id}
              variant="ghost"
              interactive
              radius="xl"
              padding="sm"
              className="flex items-center gap-4"
            >
              <div className={cn("w-6 font-semibold")}>{index + 1}</div>

              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={game.image ?? "/placeholder-card.png"}
                  alt={game.title}
                  fill
                  sizes="96px"
                  className="rounded-md object-cover"
                />
              </div>

              <div className="text-text1 font-medium">{game.title}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
