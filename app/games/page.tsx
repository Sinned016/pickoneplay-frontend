import GamesBrowser from "@/components/gamesBrowser";
import { isSortOption } from "@/lib/gameSort";
import { Game } from "@/types/Game";

type Props = {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
};

export default async function Games({ searchParams }: Props) {
  const { category, q, sort } = await searchParams;

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
    <div className="relative isolate">
      <div className="absolute -top-24 left-[10%] w-80 h-80 rounded-full bg-main1/10 blur-3xl -z-10 animate-drift" aria-hidden />
      <div className="absolute -top-24 right-[10%] w-80 h-80 rounded-full bg-main2/10 blur-3xl -z-10 animate-drift [animation-delay:-7s]" aria-hidden />

      <div className="max-w-7xl mx-auto mt-10 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Find your next{" "}
            <span className="bg-gradient-to-r from-main1 to-main2 bg-clip-text text-transparent">
              dilemma
            </span>
          </h1>
          <p className="mt-2 text-muted">
            {games.length.toLocaleString()} would-you-rather games — search, filter and pick one.
          </p>
        </div>

        <GamesBrowser
          games={games}
          initialCategory={category}
          initialQuery={q}
          initialSort={isSortOption(sort) ? sort : undefined}
        />
      </div>
    </div>
  );
}
