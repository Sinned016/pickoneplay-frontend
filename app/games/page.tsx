import GamesBrowser from "@/components/gamesBrowser";
import { Game } from "@/types/Game";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function Games({ searchParams }: Props) {
  const { category } = await searchParams;

  let games: Game[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/games`);

    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }

    const json = await res.json();

    if (json.status !== "success") {
      throw new Error(json.message);
    }

    games = json.data;
  } catch (err) {
    console.error(err);
    games = [];
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-black text-text1 mb-6">
        All games
      </h1>

      <GamesBrowser games={games} initialCategory={category} />
    </div>
  );
}
