import CategoryBrowse from "@/components/categoryBrowse";
import CreateGameBanner from "@/components/createGameBanner";
import FeaturedGames from "@/components/featuredGames";
import Hero from "@/components/hero";
import TopGames from "@/components/topGames";
import { Game } from "@/types/Game";

export default async function Home() {
  let topGames: Game[] = [];
  let newGames: Game[] = [];
  let categories: string[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/games/home`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch games");
    }

    const json = await res.json();

    // Handles your API's own error response
    if (json.status !== "success") {
      throw new Error(json.message);
    }

    topGames = json.data.topGames;
    newGames = json.data.newGames;
    categories = json.data.categories;
  } catch (err) {
    console.error(err);
  }

  return (
    <div>
      <div className="mx-auto">
        <Hero />

        <div className="flex flex-col lg:flex-row gap-6 mt-8 mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="lg:flex-2">
            <FeaturedGames games={newGames} />
          </div>

          <div className="lg:flex-1">
            {/* Gotta make some type of system so i can calculate top games when i fetch in backend, then pass those down here. */}
            <TopGames games={topGames} />
          </div>
        </div>

        <CategoryBrowse categories={categories} />

        <CreateGameBanner />
      </div>
    </div>
  );
}
