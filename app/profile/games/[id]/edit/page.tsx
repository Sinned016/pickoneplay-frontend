import EditGamePage from "@/components/edit/editGamePage";
import EmptyState from "@/components/ui/EmptyState";
import { getCurrentUserOnServer } from "@/lib/auth/getCurrentUserOnServer";
import { GameWithPairs } from "@/types/Game";
import { SearchX } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGame({ params }: Props) {
  const { id } = await params;

  const currentUser = await getCurrentUserOnServer();

  if (!currentUser) {
    redirect("/");
  }

  let game: GameWithPairs | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/getFullGame/${id}`,
      { cache: "no-store" },
    );

    const json = await res.json();

    if (json.status === "success") {
      game = json.data;
    }
  } catch (err) {
    console.error(err);
    game = null;
  }

  if (!game || game.createdBy !== currentUser.id) {
    return (
      <EmptyState
        icon={SearchX}
        title="Game not found"
        description="This game doesn't exist or you don't have access to edit it."
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-black text-text1 mb-6">
        Edit Game
      </h1>

      <EditGamePage game={game} />
    </div>
  );
}
