import EditGamePage from "@/components/edit/editGamePage";
import EmptyState from "@/components/ui/EmptyState";
import { getCurrentUserOnServer } from "@/lib/auth/getCurrentUserOnServer";
import { GameWithPairs } from "@/types/Game";
import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";
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
    <div className="max-w-5xl mx-auto">
      <Link
        href="/profile/games"
        className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-text1 mb-4"
      >
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Back to my games
      </Link>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white">
          Edit{" "}
          <span className="bg-gradient-to-r from-main1 to-main2 bg-clip-text text-transparent">
            {game.title}
          </span>
        </h2>
        <p className="mt-1 text-muted">
          Tweak the details, swap images or add more rounds.
        </p>
      </div>

      <EditGamePage game={game} />
    </div>
  );
}
