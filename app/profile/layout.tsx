import ProfileHeader from "@/components/profile/profileHeader";
import ProfileNav from "@/components/profile/profileNav";
import { getCurrentUserOnServer } from "@/lib/auth/getCurrentUserOnServer";
import { Game } from "@/types/Game";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUserOnServer();

  // if user === null we send them back to home
  if (!user) {
    redirect("/");
  }

  // The user's games, only used for the header stats.
  let games: Game[] = [];

  try {
    const cookieStore = await cookies();
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
  }

  const stats = {
    games: games.length,
    plays: games.reduce((sum, game) => sum + game.plays, 0),
  };

  return (
    <div className="relative isolate">
      <div className="absolute -top-24 left-[10%] w-80 h-80 rounded-full bg-main1/10 blur-3xl -z-10 animate-drift" aria-hidden />
      <div className="absolute -top-24 right-[10%] w-80 h-80 rounded-full bg-main2/10 blur-3xl -z-10 animate-drift [animation-delay:-7s]" aria-hidden />

      <div className="max-w-7xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 mb-10">
          <ProfileHeader user={user} stats={stats} />
          <ProfileNav />
        </div>

        {children}
      </div>
    </div>
  );
}
