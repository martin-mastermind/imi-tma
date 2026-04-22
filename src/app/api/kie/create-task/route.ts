import { NextRequest, NextResponse } from "next/server";
import { kieCreateTask } from "../lib";
import { computePrice, getFullModel } from "@/lib/catalog";

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
    const modelId = typeof b.modelId === "string" ? b.modelId : "";
    const options =
      b.options && typeof b.options === "object"
        ? (b.options as Record<string, string>)
        : {};
    const expectedPrice =
      typeof b.expectedPrice === "number" ? b.expectedPrice : -1;
    const imageInputs = Array.isArray(b.imageInputs)
      ? b.imageInputs.filter((u): u is string => typeof u === "string")
      : [];

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 },
      );
    }

    if (!modelId) {
      return NextResponse.json(
        { error: "modelId is required" },
        { status: 400 },
      );
    }

    // Look up model from catalog
    const model = getFullModel(modelId);
    if (!model) {
      return NextResponse.json(
        { error: "Model not found" },
        { status: 404 },
      );
    }

    // Validate price
    const computedPrice = computePrice(modelId, options);
    if (computedPrice !== expectedPrice) {
      return NextResponse.json(
        { error: "Price mismatch" },
        { status: 400 },
      );
    }

    // Resolve provider values
    const resolutionValueId = options.resolution || "1K";
    const aspectRatioValueId = options.aspect_ratio || "1:1";
    const outputFormatValueId = options.output_format || "jpg";

    const resolutionOption = model.options.find(
      (opt) => opt.id === "resolution",
    );
    const resolutionValue = resolutionOption?.values.find(
      (v) => v.id === resolutionValueId,
    );
    const resolvedResolution =
      resolutionValue?.providerValue || resolutionValueId;

    const outputFormatOption = model.options.find(
      (opt) => opt.id === "output_format",
    );
    const outputFormatValue = outputFormatOption?.values.find(
      (v) => v.id === outputFormatValueId,
    );
    const resolvedOutputFormat =
      outputFormatValue?.providerValue || outputFormatValueId;

    const taskId = await kieCreateTask({
      prompt,
      aspectRatio: aspectRatioValueId,
      resolution: resolvedResolution,
      outputFormat: resolvedOutputFormat,
      imageInputs,
      providerModelId: model.providerModelId,
    });

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
