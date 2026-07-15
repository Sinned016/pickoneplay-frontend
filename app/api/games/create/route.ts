import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("STEP 2");

    const cookie = req.headers.get("cookie") || "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/game/create`,
      {
        method: "POST",
        headers: {
          cookie,
          // DO NOT set Content-Type manually
        },
        body: req.body, // IMPORTANT: stream forward
        duplex: "half", // required in Node (important in Next 13+)
      } as any,
    );

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