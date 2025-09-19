/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";

type Body = { message?: string };

export async function POST(request: Request) {
    const data = (await request.json().catch(() => null)) as Partial<Body> | null;

  const message = (data?.message ?? "").trim();


  if (!message) {
    return NextResponse.json(
      { error: "Invalid or missing body" },
      { status: 400 }
    );
  }

  try {
    const response = await generateResponse(message);

    return NextResponse.json({ response }, { status: 200 });
  } catch (err) {
    console.error("Upstream/provider error:", err);
    return NextResponse.json(
      { error: "Upstream provider error" },
      { status: 502 }
    );
  }
}
