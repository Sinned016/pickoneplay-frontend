"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Car,
  Clapperboard,
  Dices,
  Dumbbell,
  Gamepad2,
  Heart,
  LucideIcon,
  Music,
  PawPrint,
  Plane,
  Shirt,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { createElement, MouseEvent } from "react";

type Props = {
  categories: string[];
  counts?: Record<string, number>;
};

// Categories are free text, so match on keywords and fall back to a generic icon.
const categoryIcons: [RegExp, LucideIcon][] = [
  [/food|eat|drink|snack|cook|meal/, UtensilsCrossed],
  [/animal|pet|dog|cat/, PawPrint],
  [/movie|film|cinema/, Clapperboard],
  [/tv|show|series|anime/, Tv],
  [/game|gaming/, Gamepad2],
  [/sport|fitness|gym/, Dumbbell],
  [/music|song|band/, Music],
  [/travel|place|country|city/, Plane],
  [/car|vehicle/, Car],
  [/fashion|cloth|style/, Shirt],
  [/love|relationship|dating/, Heart],
  [/power|super|hero/, Zap],
  [/random|misc|other/, Dices],
];

function iconFor(category: string): LucideIcon {
  const name = category.toLowerCase();
  return categoryIcons.find(([pattern]) => pattern.test(name))?.[1] ?? Sparkles;
}

function CategoryCard({
  category,
  count,
  index,
}: {
  category: string;
  count?: number;
  index: number;
}) {
  const isMain1 = index % 2 === 0;

  // Feed the cursor position to the radial glow below.
  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
    >
      <Link
        href={`/games?category=${encodeURIComponent(category)}`}
        onMouseMove={onMove}
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border1 bg-surface1 p-4 md:p-5 transition-all duration-300 hover:-translate-y-1",
          isMain1
            ? "hover:border-main1/50 hover:shadow-glow-main1"
            : "hover:border-main2/50 hover:shadow-glow-main2",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            isMain1
              ? "bg-[radial-gradient(180px_circle_at_var(--x)_var(--y),rgba(103,232,249,0.18),transparent_70%)]"
              : "bg-[radial-gradient(180px_circle_at_var(--x)_var(--y),rgba(251,113,133,0.18),transparent_70%)]",
          )}
        />

        <div
          className={cn(
            "relative flex items-center justify-center w-11 h-11 shrink-0 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
            isMain1 ? "bg-main1/15 text-main1" : "bg-main2/15 text-main2",
          )}
        >
          {createElement(iconFor(category), { size: 22 })}
        </div>

        <div className="relative min-w-0 flex-1">
          <p className="text-text1 font-semibold capitalize truncate group-hover:text-white">
            {category}
          </p>
          {count !== undefined && (
            <p className="text-xs text-muted">
              {count} {count === 1 ? "game" : "games"}
            </p>
          )}
        </div>

        <ArrowRight
          size={18}
          className="relative shrink-0 text-muted opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
        />
      </Link>
    </motion.div>
  );
}

export default function CategoryBrowse({ categories, counts }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-2xl text-text1 font-semibold">
          Browse by category
        </h2>

        <Link
          href="/games"
          className="group flex items-center gap-1 text-sm font-medium text-main1 hover:text-main1-hover"
        >
          See all games
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category}
            category={category}
            count={counts?.[category]}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
