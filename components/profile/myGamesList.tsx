"use client";

import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { deleteMyGame } from "@/services/profile";
import { Game } from "@/types/Game";
import { Eye, Gamepad2, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  games: Game[];
};

export default function MyGamesList({ games: initialGames }: Props) {
  const router = useRouter();
  const [games, setGames] = useState(initialGames);
  const [pendingDelete, setPendingDelete] = useState<Game | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteMyGame(pendingDelete.id);
      setGames((prev) => prev.filter((g) => g.id !== pendingDelete.id));
      setPendingDelete(null);
      // Re-render the profile header so its stats drop the deleted game.
      router.refresh();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete game. Try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (games.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-2xl border border-dashed border-border1-strong bg-surface1"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, 0], y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl p-4 bg-gradient-to-br from-main1/15 to-main2/15 border border-border1"
        >
          <Gamepad2 className="w-10 h-10 text-main1" />
        </motion.div>
        <h2 className="text-2xl font-black text-white">No games yet</h2>
        <p className="text-muted max-w-sm">
          Your would-you-rather ideas deserve an audience. Create your first
          game and it will show up here.
        </p>
        <Button href="/create" variant="primary" size="lg" className="mt-2">
          <Plus size={18} />
          Create your first game
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {games.map((game, index) => {
            const isMain1 = index % 2 === 0;

            return (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={cn(
                  "group flex flex-col overflow-hidden rounded-2xl border border-border1 bg-surface1 backdrop-blur-xl transition-[box-shadow,border-color] duration-300",
                  isMain1
                    ? "hover:border-main1/40 hover:shadow-glow-main1"
                    : "hover:border-main2/40 hover:shadow-glow-main2",
                )}
              >
                <Link
                  href={`/game/${game.id}`}
                  className="relative block aspect-video w-full overflow-hidden"
                >
                  <Image
                    src={game.image ?? "/placeholder-card.png"}
                    alt={game.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <span className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur-md border border-border1-strong py-0.5 px-2.5 text-[11px] font-semibold uppercase tracking-wide text-text1-hover">
                    {game.category}
                  </span>

                  <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md border border-border1-strong py-0.5 px-2.5 text-xs font-semibold text-white tabular-nums">
                    <Play size={11} />
                    {game.plays.toLocaleString()}
                  </span>

                  <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/30">
                    <Eye size={18} /> View game
                  </span>
                </Link>

                <div className="flex flex-col gap-1 p-4">
                  <h2 className="text-lg font-bold text-white line-clamp-1">
                    {game.title}
                  </h2>
                  <p className="text-sm text-muted line-clamp-2 min-h-10">
                    {game.description}
                  </p>
                  <p className="text-xs text-muted/80 mt-1">
                    Created{" "}
                    {new Date(game.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 p-4 pt-0 mt-auto">
                  <Button
                    variant="secondary"
                    size="sm"
                    href={`/profile/games/${game.id}/edit`}
                    className="flex-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${game.title}`}
                    className="text-error hover:text-error-hover hover:bg-error/10"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(game);
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <ConfirmModal
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This will permanently delete the game and all its pairs. This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setPendingDelete(null);
          setDeleteError(null);
        }}
      />
    </>
  );
}
