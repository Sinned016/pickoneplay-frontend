"use client";

import { cn } from "@/lib/utils";
import { Game } from "@/types/Game";
import { Crown, Flame, Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  games: Game[];
};

const rankClasses: Record<number, string> = {
  2: "bg-gradient-to-br from-slate-200 to-slate-400 text-black",
  3: "bg-gradient-to-br from-amber-500 to-amber-700 text-black",
};

export default function TopGames({ games }: Props) {
  const topGames = [...games].sort((a, b) => b.plays - a.plays).slice(0, 10);
  const [first, ...rest] = topGames;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-2xl text-text1 font-semibold mb-6">
        <Flame className="w-6 h-6 text-main2" />
        Top games
      </h2>

      {first && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href={`/game/${first.id}`}
            className="group relative block aspect-video overflow-hidden rounded-2xl border border-amber-300/40 shadow-[0_0_0_1px_rgba(252,211,77,0.25),0_12px_40px_-10px_rgba(252,211,77,0.35)] mb-3"
          >
            <Image
              src={first.image ?? "/placeholder-card.png"}
              alt={first.title}
              fill
              sizes="(max-width: 1024px) 100vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-amber-300 py-1 px-3 text-xs font-black text-black">
              <Crown size={14} strokeWidth={2.5} />
              #1 most played
            </span>

            <div className="absolute bottom-0 inset-x-0 p-4">
              <p className="text-lg font-black text-white line-clamp-1">
                {first.title}
              </p>
              <p className="flex items-center gap-1 text-sm text-text1">
                <Play size={12} /> {first.plays.toLocaleString()} plays
              </p>
            </div>
          </Link>
        </motion.div>
      )}

      <ol className="flex flex-col gap-1">
        {rest.map((game, i) => {
          const rank = i + 2;

          return (
            <motion.li
              key={game.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/game/${game.id}`}
                className="group flex items-center gap-3 rounded-xl p-2 border border-transparent hover:border-border1-strong hover:bg-surface1-hover transition-all"
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-7 h-7 shrink-0 rounded-full text-sm font-black tabular-nums",
                    rankClasses[rank] ?? "bg-surface2 text-muted",
                  )}
                >
                  {rank}
                </span>

                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={game.image ?? "/placeholder-card.png"}
                    alt={game.title}
                    fill
                    sizes="96px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-text1 font-medium truncate group-hover:text-white">
                    {game.title}
                  </p>
                  <p className="text-xs text-muted capitalize">{game.category}</p>
                </div>

                <span className="flex items-center gap-1 text-xs text-muted tabular-nums shrink-0">
                  <Play size={11} />
                  {game.plays.toLocaleString()}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
