"use client";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import VsDivider from "@/components/ui/VsDivider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { Game } from "@/types/Game";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  games: Game[];
  stats: { games: number; plays: number; categories: number };
};

const DILEMMAS = [
  "pizza or burgers?",
  "fly or be invisible?",
  "beach or mountains?",
  "cats or dogs?",
  "past or future?",
  "summer or winter?",
];

const ROTATE_MS = 2600;
const DUEL_MS = 4000;

function DuelCard({ game, side }: { game: Game; side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <motion.div
      key={game.id}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, rotate: isLeft ? -18 : 18 }}
      animate={{ opacity: 1, x: 0, rotate: isLeft ? -7 : 7 }}
      exit={{ opacity: 0, y: 40, rotate: isLeft ? -14 : 14 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      className={cn(
        "absolute top-1/2 w-[46%] max-w-60 -translate-y-1/2 [backface-visibility:hidden] [transform-style:preserve-3d]",
        isLeft ? "left-[2%]" : "right-[2%]",
      )}
    >
      <Link
        href={`/game/${game.id}`}
        className={cn(
          "block relative aspect-4/5 overflow-hidden rounded-2xl border-2 animate-float",
          isLeft
            ? "border-main1/70 shadow-glow-main1-lg"
            : "border-main2/70 shadow-glow-main2-lg [animation-delay:-3s]",
        )}
      >
        <Image
          src={game.image ?? "/placeholder-card.png"}
          alt={game.title}
          fill
          sizes="(min-width: 1024px) 240px, 46vw"
          quality={90}
          loading="eager"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
        <p className="absolute bottom-0 inset-x-0 p-3 text-sm font-bold text-white line-clamp-2">
          {game.title}
        </p>
      </Link>
    </motion.div>
  );
}

export default function Hero({ games, stats }: Props) {
  const user = useAuth((state) => state.user);
  const isUserLoggedIn = !!user;

  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [duelIndex, setDuelIndex] = useState(0);

  const duelGames = games.filter((g) => g.image).slice(0, 8);
  const duelCount = Math.floor(duelGames.length / 2);
  const hasDuel = duelCount > 0;

  useEffect(() => {
    const interval = setInterval(
      () => setDilemmaIndex((i) => (i + 1) % DILEMMAS.length),
      ROTATE_MS,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (duelCount < 2) return;
    const interval = setInterval(
      () => setDuelIndex((i) => (i + 1) % duelCount),
      DUEL_MS,
    );
    return () => clearInterval(interval);
  }, [duelCount]);

  const leftGame = duelGames[duelIndex * 2];
  const rightGame = duelGames[duelIndex * 2 + 1];

  return (
    <header className="relative isolate overflow-hidden hero-bg">
      <div
        className="absolute -z-10 top-1/4 left-[5%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-main1/20 blur-3xl animate-drift"
        aria-hidden
      />
      <div
        className="absolute -z-10 bottom-0 right-[5%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-main2/20 blur-3xl animate-drift [animation-delay:-7s]"
        aria-hidden
      />
      {/* Faint grid for texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        aria-hidden
      />

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid gap-14 items-center",
          hasDuel ? "lg:grid-cols-[1.1fr_1fr]" : "max-w-3xl",
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("text-center", hasDuel && "lg:text-left")}
        >
          <span className="inline-flex items-center gap-2 py-1.5 px-4 mb-6 rounded-full border border-border1-strong bg-surface1 backdrop-blur-sm text-sm font-medium text-text1">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-main1 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-main1" />
            </span>
            Pick one. See who agrees.
          </span>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.02]">
            The Ultimate
            <span className="block bg-gradient-to-r from-main1 via-white to-main2 bg-clip-text text-transparent animate-gradient-pan">
              Would You Rather
            </span>
            Experience
          </h1>

          <div className="mt-6 h-16 sm:h-9 text-xl sm:text-2xl font-semibold text-text1 overflow-hidden">
            <span className="block sm:inline text-muted">Would you rather </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={dilemmaIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "inline-block",
                  dilemmaIndex % 2 === 0 ? "text-main1" : "text-main2",
                )}
              >
                {DILEMMAS[dilemmaIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div
            className={cn(
              "mt-10 flex flex-wrap justify-center gap-4",
              hasDuel && "lg:justify-start",
            )}
          >
            <Button href="/games" variant="primary" size="lg">
              Browse games
            </Button>

            {isUserLoggedIn ? (
              <Button href="/create" variant="accent" size="lg">
                Create Game
              </Button>
            ) : (
              <Button href="/login" variant="accent" size="lg">
                Login to create
              </Button>
            )}
          </div>

          {stats.games > 0 && (
            <dl
              className={cn(
                "mt-12 flex justify-center gap-8 sm:gap-12",
                hasDuel && "lg:justify-start",
              )}
            >
              {[
                { label: "Games", value: stats.games, color: "text-main1" },
                { label: "Plays", value: stats.plays, color: "text-white" },
                { label: "Categories", value: stats.categories, color: "text-main2" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-widest text-muted">
                    {stat.label}
                  </dt>
                  <dd className={cn("text-3xl font-black tabular-nums", stat.color)}>
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>

        {hasDuel && leftGame && rightGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-lg aspect-5/4"
          >
            <AnimatePresence>
              <DuelCard key={`l-${leftGame.id}`} game={leftGame} side="left" />
              <DuelCard key={`r-${rightGame.id}`} game={rightGame} side="right" />
            </AnimatePresence>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <VsDivider size="lg" />
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
