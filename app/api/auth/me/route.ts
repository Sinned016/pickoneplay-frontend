import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        // IMPORTANT: forward cookies to backend
        cookie: cookie,
      },
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (err: any) {
    return NextResponse.json(
      { user: null, error: err.message },
      { status: 500 },
    );
  }
}
