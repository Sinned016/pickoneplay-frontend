import Card from "@/components/ui/Card";
import { Game } from "@/types/Game";
import Image from "next/image";
import Link from "next/link";

type Props = {
  games: Game[];
};

export default function RecommendedGames({ games }: Props) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl text-text1 font-semibold mb-6">
        Recommended games
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {games.map((game) => (
          <Link href={`/game/${game.id}`} key={game.id}>
            <Card variant="ghost" interactive radius="xl" padding="none">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl">
                <Image
                  src={game.image ?? "/placeholder-card.png"}
                  alt={game.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <p className="absolute bottom-0 left-0 right-0 line-clamp-2 p-3 text-sm font-medium text-white">
                  {game.title}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
