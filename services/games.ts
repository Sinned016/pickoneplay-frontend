export async function createGame(data: FormData) {
  console.log("STEP 1");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/create`,
    {
      method: "POST",
      credentials: "include",
      body: data, // IMPORTANT: keep FormData as-is
    },
  );

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to create game");
  }

  return responseData;
}

export async function updatePairScore(data: any) {
  console.log("STEP 1");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/updatePairScore`,
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
    throw new Error(responseData?.message || "Failed to update pair score");
  }

  return responseData;
}

export async function updatePlayScore(gameId: string) {
  console.log("STEP 1");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/updatePlayScore/${gameId}`,
    {
      method: "PUT",
      credentials: "include",
    },
  );

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || "Failed to update play score");
  }

  return responseData;
}
