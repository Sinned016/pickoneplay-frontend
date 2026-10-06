"use client";

import EmptyState from "@/components/ui/EmptyState";
import GameCard from "@/components/ui/GameCard";
import Input from "@/components/ui/Input";
import { SortOption, sortLabels } from "@/lib/gameSort";
import { cn } from "@/lib/utils";
import { Game } from "@/types/Game";
import { ArrowUpDown, LayoutGrid, Search, SearchX, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  games: Game[];
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: SortOption;
};

const SEARCH_DEBOUNCE_MS = 200;

export default function GamesBrowser({
  games,
  initialCategory,
  initialQuery,
  initialSort,
}: Props) {
  const [category, setCategory] = useState<string | null>(
    initialCategory ?? null,
  );
  const [query, setQuery] = useState(initialQuery ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOption>(initialSort ?? "newest");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  // Keep the URL shareable without re-running the server fetch on every keystroke.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (category) params.set("category", category);
    if (sort !== "newest") params.set("sort", sort);

    const search = params.toString();
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
  }, [debouncedQuery, category, sort]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    games.forEach((game) => {
      counts.set(game.category, (counts.get(game.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [games]);

  const filteredGames = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();

    const matches = games.filter((game) => {
      if (category && game.category !== category) return false;
      if (!needle) return true;

      return [game.title, game.description, game.category, ...game.tags]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(needle));
    });

    return matches.sort((a, b) => {
      if (sort === "popular") return b.plays - a.plays;
      if (sort === "az") return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [games, category, debouncedQuery, sort]);

  const hasFilters = !!category || !!query.trim() || sort !== "newest";

  function clearFilters() {
    setCategory(null);
    setQuery("");
    setDebouncedQuery("");
    setSort("newest");
  }

  if (games.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="No games yet"
        description="Be the first to create a PickOnePlay game."
      />
    );
  }

  const chips: { value: string | null; label: string; count: number }[] = [
    { value: null, label: "All", count: games.length },
    ...categoryCounts.map(([cat, count]) => ({ value: cat, label: cat, count })),
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-4 sm:mx-0 mb-8 px-4 sm:px-4 py-4 sm:rounded-2xl bg-background/80 sm:bg-surface1 backdrop-blur-xl border-y sm:border border-border1 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              icon={Search}
              type="search"
              placeholder="Search games, tags, categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search games"
              className="[&::-webkit-search-cancel-button]:hidden pr-6"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted hover:text-text1 hover:bg-surface2 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 rounded-lg border border-border1-strong bg-surface1 py-2.5 px-3 text-text1 focus-within:border-border1-focus focus-within:shadow-glow-main1 transition-all">
            <ArrowUpDown className="w-5 h-5 text-muted shrink-0" />
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent outline-none cursor-pointer pr-1 [&>option]:bg-background"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <option key={option} value={option}>
                  {sortLabels[option]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-visible">
          {chips.map((chip) => {
            const active = category === chip.value;

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => setCategory(chip.value)}
                className={cn(
                  "relative isolate shrink-0 flex items-center gap-1.5 py-1.5 px-4 rounded-full text-sm font-medium border transition-colors capitalize cursor-pointer",
                  active
                    ? "border-main1 text-black"
                    : "border-border1-strong text-text1 hover:border-border1-hover hover:text-white",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-category"
                    className="absolute inset-0 -z-10 rounded-full bg-main1 shadow-glow-main1"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {chip.label}
                <span className={cn("text-xs tabular-nums", active ? "text-black/60" : "text-muted")}>
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <p className="text-muted">
          <span className="font-semibold text-text1">{filteredGames.length}</span>{" "}
          {filteredGames.length === 1 ? "game" : "games"}
          {debouncedQuery.trim() && (
            <>
              {" "}for <span className="text-main1">&ldquo;{debouncedQuery.trim()}&rdquo;</span>
            </>
          )}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-main2 hover:text-main2-hover font-medium cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredGames.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <div className="rounded-full p-4 bg-gradient-to-br from-main1/15 to-main2/15 border border-border1">
            <SearchX className="w-8 h-8 text-main2" />
          </div>
          <h2 className="text-xl font-bold text-text1">No games match that</h2>
          <p className="text-muted max-w-sm">
            Try a different search or category.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 py-2 px-4 rounded-lg border border-border1-strong text-text1 hover:bg-surface1-hover cursor-pointer"
          >
            Clear filters
          </button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                layout
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
