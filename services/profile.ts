import { GameWithPairs } from "@/types/Game";

export async function updateSettings(data: {
  username?: string;
  password?: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/settings/update`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to update settings");
  }

  return responseData;
}

export async function getMyGames() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/games`, {
    method: "GET",
    credentials: "include",
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to fetch your games");
  }

  return responseData;
}

export async function updateMyGame(
  gameId: string,
  data: FormData,
): Promise<{ status: string; data: GameWithPairs; message: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/games/update/${gameId}`,
    {
      method: "PUT",
      credentials: "include",
      body: data, // IMPORTANT: keep FormData as-is
    },
  );

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to update game");
  }

  return responseData;
}

export async function deleteMyGame(gameId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/games/delete/${gameId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to delete game");
  }

  return responseData;
}
