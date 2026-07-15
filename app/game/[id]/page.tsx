import GameController from "@/components/game/gameController";
import EmptyState from "@/components/ui/EmptyState";
import { Game, GameWithPairs } from "@/types/Game";
import { SearchX } from "lucide-react";

type Props = {
  params: {
    id: string;
  };
};

const RECOMMENDED_COUNT = 6;

export default async function Page({ params }: Props) {
  const { id } = await params;

  // Fetch game
  let game: GameWithPairs | null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/getFullGame/${id}`,
    );

    const json = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    game = json.data;
  } catch (err) {
    console.log(err);
    game = null;
  }

  if (!game) {
    return (
      <EmptyState
        icon={SearchX}
        title="Game not found"
        description="This game doesn't exist or may have been removed."
      />
    );
  }

  // Fetch recommended games
  let recommendedGames: Game[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/games`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }

    const json = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    recommendedGames = (json.data as Game[])
      .filter((g) => g.id !== game!.id)
      .slice(0, RECOMMENDED_COUNT);
  } catch (err) {
    console.error(err);
    recommendedGames = [];
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
      <GameController game={game} recommendedGames={recommendedGames} />
    </div>
  );
}
