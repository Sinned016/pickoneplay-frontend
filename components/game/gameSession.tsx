"use client";
import VsDivider from "@/components/ui/VsDivider";
import { cn } from "@/lib/utils";
import { updatePairScore } from "@/services/games";
import { GameWithPairs, Pair } from "@/types/Game";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Answer } from "./gameController";

type Side = "left" | "right";

type GameProps = {
  game: GameWithPairs;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  answers: Answer[];
  setAnswers: Dispatch<SetStateAction<Answer[]>>;
};

type ChoiceHalfProps = {
  name: string;
  image: string | null;
  side: Side;
  selectedSide: Side | null;
  hoveredSide: Side | null;
  setHoveredSide: (side: Side | null) => void;
  onChoose: () => void;
};

// How long the pick stays on screen before the next round slides in.
const HOLD_MS = 750;

const sideStyles: Record<
  Side,
  { tint: string; text: string; chip: string; ring: string; edge: string }
> = {
  left: {
    tint: "from-main1/45",
    text: "text-main1",
    chip: "bg-main1 text-black",
    ring: "border-main1",
    edge: "shadow-[inset_0_0_0_4px_var(--color-main1),inset_0_0_80px_-10px_var(--color-main1)]",
  },
  right: {
    tint: "from-main2/45",
    text: "text-main2",
    chip: "bg-main2 text-black",
    ring: "border-main2",
    edge: "shadow-[inset_0_0_0_4px_var(--color-main2),inset_0_0_80px_-10px_var(--color-main2)]",
  },
};

function ChoiceHalf({
  name,
  image,
  side,
  selectedSide,
  hoveredSide,
  setHoveredSide,
  onChoose,
}: ChoiceHalfProps) {
  const styles = sideStyles[side];
  const isSelected = selectedSide === side;
  const isDimmed = selectedSide !== null && !isSelected;
  const isHovered = selectedSide === null && hoveredSide === side;
  const isOtherHovered =
    selectedSide === null && hoveredSide !== null && hoveredSide !== side;

  // The picked half takes over most of the screen; on hover it just leans in.
  const grow = isSelected ? 4 : isDimmed ? 1 : isHovered ? 1.2 : 1;

  return (
    <motion.button
      type="button"
      onClick={onChoose}
      disabled={selectedSide !== null}
      onHoverStart={() => setHoveredSide(side)}
      onHoverEnd={() => setHoveredSide(null)}
      initial={{ opacity: 0, x: side === "left" ? -80 : 80 }}
      animate={{ opacity: 1, x: 0, flexGrow: grow }}
      exit={{ opacity: 0, x: side === "left" ? -80 : 80 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      style={{ flexBasis: 0 }}
      aria-label={`Pick ${name}`}
      className={cn(
        "group relative min-w-0 min-h-0 overflow-hidden cursor-pointer disabled:cursor-default focus-visible:outline-none",
        isSelected && styles.edge,
      )}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isSelected ? 1.06 : isHovered ? 1.05 : 1,
          filter: isDimmed
            ? "grayscale(1) brightness(0.35)"
            : isOtherHovered
              ? "grayscale(0.3) brightness(0.7)"
              : "grayscale(0) brightness(1)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* unoptimized: same url the GameController preloaded, so it paints instantly */}
        <Image
          src={image || "/placeholder-card.png"}
          alt={name}
          fill
          unoptimized
          className="object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Side-coloured tint + darkening for the label */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t via-transparent to-transparent transition-opacity duration-300",
          styles.tint,
          isHovered || isSelected ? "opacity-100" : "opacity-60",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />

      {/* Label */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 flex flex-col gap-2",
          side === "left" ? "items-start text-left" : "items-end text-right",
        )}
      >
        <span
          className={cn(
            "rounded-full py-0.5 px-2.5 text-xs font-black tracking-widest",
            styles.chip,
          )}
        >
          {side === "left" ? "A" : "B"}
        </span>
        <h3
          className={cn(
            "font-black leading-[1.05] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] transition-colors duration-300 break-words",
            "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
            isSelected && styles.text,
          )}
        >
          {name}
        </h3>
      </div>

      {/* Pick confirmation */}
      <AnimatePresence>
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 0.15].map((delay) => (
              <motion.span
                key={delay}
                className={cn("absolute w-24 h-24 rounded-full border-4", styles.ring)}
                initial={{ scale: 0.4, opacity: 1 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: 0.8, delay, ease: "easeOut" }}
              />
            ))}
            <motion.span
              className={cn(
                "flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full",
                styles.chip,
              )}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check className="w-10 h-10 md:w-12 md:h-12" strokeWidth={3.5} />
            </motion.span>
          </div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function GameSession({
  game,
  setStep,
  index,
  setIndex,
  answers,
  setAnswers,
}: GameProps) {
  const pair: Pair = game.pairs[index];
  const total = game.pairs.length;
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [hoveredSide, setHoveredSide] = useState<Side | null>(null);

  async function choose(pairId: string, name: string, side: Side) {
    setSelectedSide(side);
    setHoveredSide(null);

    setAnswers((prev) => [
      ...prev,
      {
        pairId,
        selected: side,
        name,
      },
    ]);

    const dataToSend = {
      pairId,
      name,
      side,
    };

    // Update score while the pick animation plays.
    await Promise.all([
      updatePairScore(dataToSend),
      new Promise((resolve) => setTimeout(resolve, HOLD_MS)),
    ]);

    // Set error state if it goes wrong.

    // Go to next slide
    const nextIndex = index + 1;

    if (nextIndex >= game.pairs.length) {
      // Finish game and go to results
      setStep("results");
    } else {
      setIndex(nextIndex);
      setSelectedSide(null);
    }
  }

  function back() {
    setIndex(0);
    setAnswers([]);
    setStep("info");
  }

  // Lock page scroll behind the full-screen session.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keyboard: ← / A picks left, → / D picks right, Esc exits.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return back();
      if (selectedSide !== null) return;

      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") {
        choose(pair.id, pair.leftName, "left");
      } else if (key === "arrowright" || key === "d") {
        choose(pair.id, pair.rightName, "right");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col h-dvh bg-background overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-20 pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-10">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={back}
            aria-label="Exit game"
            className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-border1-strong text-text1 hover:text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white text-center drop-shadow-lg">
            Would you rather…
          </h2>

          <span className="shrink-0 rounded-full bg-black/40 backdrop-blur-md border border-border1-strong py-1.5 px-3 text-sm font-bold text-text1 tabular-nums">
            {index + 1} / {total}
          </span>
        </div>

        <div className="mx-4 sm:mx-6 mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-main1 to-main2"
            initial={false}
            animate={{
              width: `${((index + (selectedSide ? 1 : 0)) / total) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      {/* Halves */}
      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait" initial={true}>
          <motion.div
            key={index}
            className="absolute inset-0 flex flex-col md:flex-row"
          >
            <ChoiceHalf
              name={pair.leftName}
              image={pair.leftImage}
              side="left"
              selectedSide={selectedSide}
              hoveredSide={hoveredSide}
              setHoveredSide={setHoveredSide}
              onChoose={() => choose(pair.id, pair.leftName, "left")}
            />

            <ChoiceHalf
              name={pair.rightName}
              image={pair.rightImage}
              side="right"
              selectedSide={selectedSide}
              hoveredSide={hoveredSide}
              setHoveredSide={setHoveredSide}
              onChoose={() => choose(pair.id, pair.rightName, "right")}
            />
          </motion.div>
        </AnimatePresence>

        {/* VS badge sitting on the seam */}
        <AnimatePresence>
          {selectedSide === null && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <VsDivider size="xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-xs text-muted/70 pointer-events-none">
        Tip: use ← / → to pick
      </p>
    </div>
  );
}
