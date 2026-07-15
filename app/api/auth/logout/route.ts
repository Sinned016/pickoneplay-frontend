import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("hello");
    const cookieStore = await cookies();

    cookieStore.set("jwt", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return Response.json({ success: true });
  } catch (err: any) {}
}
