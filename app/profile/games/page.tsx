import MyGamesList from "@/components/profile/myGamesList";
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
      <h1 className="text-2xl md:text-3xl font-black text-text1 mb-6">
        My Games
      </h1>

      <MyGamesList games={games} />
    </div>
  );
}
