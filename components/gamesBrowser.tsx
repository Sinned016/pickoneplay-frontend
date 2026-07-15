"use client";

import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import { Game } from "@/types/Game";
import { LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  games: Game[];
  initialCategory?: string;
};

export default function GamesBrowser({ games, initialCategory }: Props) {
  const [category, setCategory] = useState<string | null>(
    initialCategory ?? null,
  );

  const categories = Array.from(new Set(games.map((game) => game.category)));

  const filteredGames = category
    ? games.filter((game) => game.category === category)
    : games;

  if (games.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No games yet"
        description="Be the first to create a PickOnePlay game."
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn(
            "py-1.5 px-4 rounded-full text-sm font-medium border transition-colors capitalize",
            category === null
              ? "bg-main1 text-black border-main1"
              : "border-border1-strong text-text1 hover:border-border1-hover",
          )}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "py-1.5 px-4 rounded-full text-sm font-medium border transition-colors capitalize",
              category === cat
                ? "bg-main1 text-black border-main1"
                : "border-border1-strong text-text1 hover:border-border1-hover",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <p className="text-muted text-sm">No games in this category yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {filteredGames.map((game) => (
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
