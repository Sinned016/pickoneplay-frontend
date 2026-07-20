"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import { deleteMyGame } from "@/services/profile";
import { Game } from "@/types/Game";
import { Gamepad2, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  games: Game[];
};

export default function MyGamesList({ games: initialGames }: Props) {
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
      <EmptyState
        icon={Gamepad2}
        title="No games yet"
        description="Create your first game to see it here."
      />
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            variant="surface1"
            radius="2xl"
            padding="md"
            className="flex flex-col gap-4"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={game.image ?? "/placeholder-card.png"}
                alt={game.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-text1 line-clamp-1">
                {game.title}
              </h2>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="solid" tone="main1">
                  {game.category}
                </Badge>

                <span className="flex items-center gap-1 text-sm text-muted">
                  <Play size={14} />
                  {game.plays}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <Button
                variant="secondary"
                size="sm"
                href={`/profile/games/${game.id}/edit`}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setDeleteError(null);
                  setPendingDelete(game);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

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
