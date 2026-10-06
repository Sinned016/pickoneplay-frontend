"use client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CountUp from "@/components/ui/CountUp";
import VsDivider from "@/components/ui/VsDivider";
import { cn } from "@/lib/utils";
import { GameWithPairs, Pair } from "@/types/Game";
import { Crown, LayoutGrid, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Answer } from "./gameController";

type GameProps = {
  id: string;
  setStep: Dispatch<SetStateAction<"info" | "session" | "results">>;
  answers: Answer[];
  setAnswers: Dispatch<SetStateAction<Answer[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
};

type Side = "left" | "right";

function getWinner(pair: Pair): Side | "tie" {
  if (pair.leftScore > pair.rightScore) return "left";
  if (pair.rightScore > pair.leftScore) return "right";
  return "tie";
}

function getVerdict(percent: number) {
  if (percent >= 70)
    return { title: "Crowd Pleaser", text: "You think just like everyone else." };
  if (percent >= 40)
    return { title: "Wildcard", text: "Half with the crowd, half your own way." };
  return { title: "Rebel", text: "You go your own way — rarely with the majority." };
}

function MajorityRing({ percent }: { percent: number }) {
  const radius = 52;

  return (
    <div className="relative w-36 h-36 md:w-40 md:h-40 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-main1)" />
            <stop offset="100%" stopColor="var(--color-main2)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: percent / 100 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <CountUp value={percent} suffix="%" className="text-3xl md:text-4xl font-black text-white tabular-nums" />
        <span className="text-xs text-muted">with majority</span>
      </div>
    </div>
  );
}

function ResultSide({
  name,
  image,
  side,
  picked,
  winner,
}: {
  name: string;
  image: string | null;
  side: Side;
  picked: boolean;
  winner: boolean;
}) {
  const isLeft = side === "left";

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative w-full aspect-square overflow-hidden rounded-xl border-2 transition-shadow",
          picked
            ? isLeft
              ? "border-main1 shadow-glow-main1"
              : "border-main2 shadow-glow-main2"
            : "border-border1",
        )}
      >
        <Image
          src={image || "/placeholder-card.png"}
          alt={name}
          fill
          unoptimized
          className={cn("object-cover", !picked && "opacity-80")}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

        {winner && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.6 }}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-amber-300 text-black shadow-lg"
            aria-label="Winner"
          >
            <Crown size={16} strokeWidth={2.5} />
          </motion.span>
        )}

        {picked && (
          <span
            className={cn(
              "absolute top-2 left-2 rounded-full py-0.5 px-2 text-[11px] font-bold text-black",
              isLeft ? "bg-main1" : "bg-main2",
            )}
          >
            Your pick
          </span>
        )}

        <p className="absolute bottom-0 inset-x-0 p-2 sm:p-3 text-center text-sm sm:text-base font-bold text-white line-clamp-2">
          {name}
        </p>
      </div>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-80 rounded-2xl bg-surface1 border border-border1 animate-pulse" />
      ))}
    </div>
  );
}

export default function GameResults({
  id,
  setStep,
  answers,
  setAnswers,
  setIndex,
}: GameProps) {
  const [gameData, setGameData] = useState<GameWithPairs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGameData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/getFullGame/${id}`,
        );

        const json = await res.json();

        if (json.status !== "success") {
          throw new Error(json.message);
        }

        setGameData(json.data);
      } catch (err) {
        // set error state
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGameData();
  }, [id]);

  function back() {
    setIndex(0);
    setAnswers([]);
    setStep("info");
  }

  // How often the player sided with the majority (ties count as agreeing).
  const answered = gameData?.pairs.filter((pair) =>
    answers.some((a) => a.pairId === pair.id),
  ) ?? [];
  const agreed = answered.filter((pair) => {
    const winner = getWinner(pair);
    const pick = answers.find((a) => a.pairId === pair.id)?.selected;
    return winner === "tie" || winner === pick;
  }).length;
  const majorityPercent =
    answered.length === 0 ? 0 : Math.round((agreed / answered.length) * 100);
  const verdict = getVerdict(majorityPercent);

  const actions = (
    <div className="flex flex-wrap justify-center gap-3">
      <Button onClick={back} variant="primary" size="lg">
        <RotateCcw size={18} />
        Play again
      </Button>
      <Button href="/games" variant="secondary" size="lg">
        <LayoutGrid size={18} />
        Browse more games
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      {loading && (
        <>
          <div className="h-48 rounded-2xl bg-surface1 border border-border1 animate-pulse" />
          <ResultSkeleton />
        </>
      )}

      {!loading && !gameData && (
        <div className="flex flex-col items-center gap-6 py-12">
          <p className="text-center text-error">
            Couldn&apos;t load results. Please try again.
          </p>
          {actions}
        </div>
      )}

      {gameData && (
        <>
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card
              variant="surface1"
              radius="2xl"
              padding="lg"
              className="relative overflow-hidden"
            >
              <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-main1/15 blur-3xl animate-drift" aria-hidden />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-main2/15 blur-3xl animate-drift [animation-delay:-7s]" aria-hidden />

              <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
                <MajorityRing percent={majorityPercent} />

                <div className="flex-1">
                  <p className="text-sm font-medium uppercase tracking-widest text-muted">
                    {gameData.title} · Results
                  </p>
                  <h1 className="mt-2 text-4xl md:text-5xl font-black bg-gradient-to-r from-main1 via-white to-main2 bg-clip-text text-transparent">
                    {verdict.title}
                  </h1>
                  <p className="mt-2 text-text1">
                    You sided with the majority in{" "}
                    <span className="font-bold text-white">
                      {agreed} / {answered.length}
                    </span>{" "}
                    rounds. {verdict.text}
                  </p>
                </div>

                <div className="hidden lg:block">{actions}</div>
              </div>
            </Card>
          </motion.div>

          {/* Rounds */}
          <div className="grid md:grid-cols-2 gap-6">
            {gameData.pairs.map((pair, i) => {
              const userAnswer = answers.find((a) => a.pairId === pair.id);
              const winner = getWinner(pair);
              const totalVotes = pair.leftScore + pair.rightScore;
              const leftPercent =
                totalVotes === 0 ? 50 : Math.round((pair.leftScore / totalVotes) * 100);
              const rightPercent = 100 - leftPercent;
              const agreedHere =
                !!userAnswer && (winner === "tie" || winner === userAnswer.selected);

              return (
                <motion.div
                  key={pair.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 2) * 0.1, ease: "easeOut" }}
                >
                  <Card variant="surface1" radius="2xl" padding="md" className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-muted">
                        Round {i + 1}
                      </span>
                      {userAnswer && (
                        <span
                          className={cn(
                            "rounded-full py-0.5 px-2.5 text-xs font-semibold border",
                            agreedHere
                              ? "border-success/40 text-success"
                              : "border-amber-300/40 text-amber-300",
                          )}
                        >
                          {winner === "tie"
                            ? "Dead even"
                            : agreedHere
                              ? "With the crowd"
                              : "Against the crowd"}
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center gap-3 sm:gap-4">
                      <ResultSide
                        name={pair.leftName}
                        image={pair.leftImage}
                        side="left"
                        picked={userAnswer?.selected === "left"}
                        winner={winner === "left"}
                      />
                      <VsDivider className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" />
                      <ResultSide
                        name={pair.rightName}
                        image={pair.rightImage}
                        side="right"
                        picked={userAnswer?.selected === "right"}
                        winner={winner === "right"}
                      />
                    </div>

                    {/* Tug-of-war bar */}
                    <div className="mt-5">
                      <div className="flex justify-between text-lg font-black tabular-nums">
                        <CountUp value={leftPercent} suffix="%" className="text-main1" />
                        {winner === "tie" && (
                          <span className="text-sm font-semibold text-muted self-center">Tie</span>
                        )}
                        <CountUp value={rightPercent} suffix="%" className="text-main2" />
                      </div>

                      <div className="mt-1.5 flex h-3 w-full gap-1 overflow-hidden rounded-full bg-surface2">
                        <motion.div
                          className="h-full rounded-full bg-main1 shadow-glow-main1"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${leftPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                        <motion.div
                          className="ml-auto h-full rounded-full bg-main2 shadow-glow-main2"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${rightPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                      </div>

                      <div className="mt-1.5 flex justify-between text-xs text-muted tabular-nums">
                        <span>{pair.leftScore.toLocaleString()} votes</span>
                        <span>{pair.rightScore.toLocaleString()} votes</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {actions}
        </>
      )}
    </div>
  );
}
