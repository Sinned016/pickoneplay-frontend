import Card from "@/components/ui/Card";
import { Game } from "@/types/Game";
import Image from "next/image";
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
        <h2 className="flex items-center text-2xl text-text1 font-semibold">
          New games
        </h2>

        <Link
          href="/games"
          className="text-sm font-medium text-main1 hover:underline"
        >
          See all
        </Link>
      </div>

      {newGames.length === 0 ? (
        <p className="text-muted text-sm">
          No games yet — be the first to create one.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newGames.map((game) => (
            <Link href={`/game/${game.id}`} key={game.id}>
              <Card variant="ghost" interactive radius="xl" padding="none">
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl">
                  <Image
                    src={game.image ?? "/placeholder-card.png"}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
      )}
    </div>
  );
}
