"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import VsDivider from "@/components/ui/VsDivider";
import { updatePlayScore } from "@/services/games";
import { Game, GameWithPairs } from "@/types/Game";
import { CalendarDays, Check, Eye, Layers, Loader2, Play as PlayIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { Dispatch, MouseEvent, SetStateAction } from "react";
import RecommendedGames from "./recommendedGames";

type GameProps = {
  game: GameWithPairs;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  recommendedGames: Game[];
  preload: { loaded: number; total: number; done: boolean };
};

const PREVIEW_COUNT = 3;

// Cover image that tilts toward the cursor.
function TiltCover({ src, alt }: { src: string; alt: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 18 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className="[perspective:1000px]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border1-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 80vw, 380px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-main1/10 via-transparent to-main2/15" />
      </motion.div>
    </div>
  );
}

export default function GameInfo({
  game,
  setStep,
  recommendedGames,
  preload,
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

  const cover = game.image || "/placeholder-card.png";
  const createdAt = new Date(game.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const previewPairs = game.pairs.slice(0, PREVIEW_COUNT);

  return (
    <>
      <section className="relative isolate">
        {/* Ambient backdrop: the cover, blurred out to full width */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-screen h-[calc(100%+6rem)] -z-10 overflow-hidden" aria-hidden>
          <Image
            src={cover}
            alt=""
            fill
            sizes="100vw"
            className="object-cover scale-125 blur-3xl opacity-40 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[380px_1fr] gap-8 lg:gap-14 items-center pt-4 md:pt-10">
          <div className="w-3/4 max-w-xs mx-auto md:w-full md:max-w-none">
            <TiltCover src={cover} alt={`${game.title} image`} />
          </div>

          <motion.div
            className="flex flex-col gap-5 text-center md:text-left items-center md:items-start"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            {[
              <div key="badges" className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                <Badge variant="solid" tone="main1" className="capitalize">
                  {game.category}
                </Badge>
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>,

              <h1 key="title" className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                {game.title}
              </h1>,

              game.description && (
                <p key="desc" className="text-text1 text-lg leading-relaxed max-w-2xl">
                  {game.description}
                </p>
              ),

              <div key="stats" className="flex flex-wrap justify-center md:justify-start gap-2">
                {[
                  { icon: PlayIcon, label: `${game.plays.toLocaleString()} plays` },
                  { icon: Layers, label: `${game.pairs.length} rounds` },
                  { icon: CalendarDays, label: createdAt },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 rounded-full bg-surface2 border border-border1 backdrop-blur-md py-1.5 px-3 text-sm text-text1"
                  >
                    <Icon size={14} className="text-muted" />
                    {label}
                  </span>
                ))}
              </div>,

              <div key="play" className="flex flex-col items-center md:items-start gap-2 mt-2">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.span
                    className="absolute -inset-2 rounded-xl bg-gradient-to-r from-main1 to-main2 blur-xl"
                    animate={{ opacity: [0.35, 0.7, 0.35] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden
                  />
                  <Button
                    onClick={startGame}
                    variant="primary"
                    size="lg"
                    className="relative px-10 py-4 text-xl"
                  >
                    <PlayIcon size={22} className="fill-black" />
                    Play now
                  </Button>
                </motion.div>

                <span className="flex items-center gap-1.5 text-xs text-muted">
                  {preload.done ? (
                    <>
                      <Check size={14} className="text-success" /> Rounds ready
                    </>
                  ) : (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Preparing rounds {preload.loaded}/{preload.total}
                    </>
                  )}
                </span>
              </div>,
            ]
              .filter(Boolean)
              .map((child, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                  }}
                >
                  {child}
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Sneak peek at the first few rounds */}
      {previewPairs.length > 0 && (
        <section className="mt-16">
          <h2 className="flex items-center gap-2 text-2xl text-text1 font-semibold mb-6">
            <Eye size={22} className="text-main1" />
            Sneak peek
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewPairs.map((pair, i) => (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative flex h-36 overflow-hidden rounded-2xl border border-border1 bg-surface1"
              >
                {[
                  { name: pair.leftName, image: pair.leftImage, tint: "from-main1/40" },
                  { name: pair.rightName, image: pair.rightImage, tint: "from-main2/40" },
                ].map((side) => (
                  <div key={side.name} className="relative flex-1 overflow-hidden">
                    <Image
                      src={side.image || "/placeholder-card.png"}
                      alt={side.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${side.tint} via-black/30 to-transparent`} />
                    <p className="absolute bottom-0 inset-x-0 p-2 text-center text-sm font-bold text-white line-clamp-1">
                      {side.name}
                    </p>
                  </div>
                ))}
                <VsDivider className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              </motion.div>
            ))}
          </div>

          {game.pairs.length > PREVIEW_COUNT && (
            <p className="mt-4 text-sm text-muted">
              + {game.pairs.length - PREVIEW_COUNT} more rounds waiting for you.
            </p>
          )}
        </section>
      )}

      {recommendedGames.length > 0 && (
        <RecommendedGames games={recommendedGames} />
      )}
    </>
  );
}
