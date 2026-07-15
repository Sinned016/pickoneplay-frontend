import { cookies } from "next/headers";

export const getCurrentUserOnServer = async () => {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      // IMPORTANT: forward cookies to backend
      cookie: cookieStore.toString(),
    },
  });

  const data = await res.json();

  return data.user ?? null;
};
