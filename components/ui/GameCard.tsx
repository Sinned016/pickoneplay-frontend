"use client";

import { cn } from "@/lib/utils";
import { Game } from "@/types/Game";
import { Play } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Ref } from "react";

type Props = {
  game: Game;
  // Position in its grid — drives the stagger delay and which accent the hover glow uses.
  index?: number;
  sizes?: string;
  // Set when the card lives inside an AnimatePresence/layout grid (games browser).
  layout?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export default function GameCard({
  game,
  index = 0,
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw",
  layout = false,
  ref,
}: Props) {
  const isMain1 = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      layout={layout}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 10) * 0.05, ease: "easeOut" }}
    >
      <Link
        href={`/game/${game.id}`}
        className={cn(
          "group block rounded-xl transition-all duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2",
          isMain1
            ? "hover:shadow-glow-main1-lg focus-visible:ring-main1"
            : "hover:shadow-glow-main2-lg focus-visible:ring-main2",
        )}
      >
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-border1 bg-surface1">
          <Image
            src={game.image ?? "/placeholder-card.png"}
            alt={game.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {game.category && (
            <span className="absolute top-2 left-2 rounded-full bg-black/50 backdrop-blur-md border border-border1-strong py-0.5 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-text1-hover">
              {game.category}
            </span>
          )}

          {/* Play affordance that appears on hover */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full text-black opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100",
              isMain1 ? "bg-main1" : "bg-main2",
            )}
          >
            <Play size={20} className="ml-0.5 fill-black" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-white leading-snug">
              {game.title}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <Play size={11} />
              {game.plays.toLocaleString()} plays
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
