import MyGamesList from "@/components/profile/myGamesList";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Game } from "@/types/Game";
import { cookies } from "next/headers";

export default async function MyGames() {
  const cookieStore = await cookies();

  let games: Game[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/games`,
      {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    const json = await res.json();

    if (json.status === "success") {
      games = json.data;
    }
  } catch (err) {
    console.error(err);
    games = [];
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            My{" "}
            <span className="bg-gradient-to-r from-main1 to-main2 bg-clip-text text-transparent">
              games
            </span>
          </h2>
          <p className="mt-1 text-muted">
            Edit, share or clean up the games you&apos;ve created.
          </p>
        </div>

        <Button href="/create" variant="primary" className="self-start sm:self-auto">
          <Plus size={18} />
          New game
        </Button>
      </div>

      <MyGamesList games={games} />
    </div>
  );
}
