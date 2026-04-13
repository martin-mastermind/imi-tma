import { NextRequest, NextResponse } from "next/server";
import type { AspectRatio, Resolution } from "@/types";
import { kieCreateTask } from "../lib";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const b = body as Record<string, unknown>;
    const prompt = typeof b.prompt === "string" ? b.prompt : "";
    const aspectRatio = b.aspectRatio as AspectRatio;
    const resolution = (b.resolution as Resolution) ?? "1K";
    const imageInputs = Array.isArray(b.imageInputs)
      ? b.imageInputs.filter((u): u is string => typeof u === "string")
      : [];

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 },
      );
    }

    const taskId = await kieCreateTask(
      prompt,
      aspectRatio,
      resolution,
      imageInputs,
    );
    return NextResponse.json({ taskId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create task failed";
    if (message.includes("KIE_API_KEY")) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 },
      );
    }
    console.error("kie create-task:", e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
