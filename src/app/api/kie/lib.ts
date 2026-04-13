import type { AspectRatio, Resolution } from "@/types";

const BASE_URL = "https://api.kie.ai/api/v1";

function getKieApiKey(): string {
  const key = process.env.KIE_API_KEY;
  if (!key?.trim()) {
    throw new Error("KIE_API_KEY is not configured");
  }
  return key.trim();
}

export function parseResultUrlFromResultJson(
  resultJson: unknown,
): string | undefined {
  if (typeof resultJson !== "string" || !resultJson.trim()) return undefined;
  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: unknown };
    const urls = parsed.resultUrls;
    if (Array.isArray(urls) && urls.length > 0 && typeof urls[0] === "string") {
      return urls[0];
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export type KiePollState = "pending" | "success" | "failed";

export interface KiePollResult {
  state: KiePollState;
  imageUrl?: string;
  failCode?: string | null;
  failMsg?: string | null;
  errorMessage?: string;
}

export async function kieCreateTask(
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution,
  imageInputs: string[],
): Promise<string> {
  const API_KEY = getKieApiKey();
  const body: Record<string, unknown> = {
    model: "nano-banana-2",
    input: {
      prompt: prompt.trim(),
      aspect_ratio: aspectRatio,
      resolution,
      output_format: "jpg",
      ...(imageInputs.length > 0 ? { image_input: imageInputs } : {}),
    },
  };

  const res = await fetch(`${BASE_URL}/jobs/createTask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`KIE createTask failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  const data = json.data as Record<string, unknown> | undefined;
  const taskId = data?.taskId ?? data?.task_id ?? json.taskId;
  if (!taskId) throw new Error("No taskId in KIE response");
  return String(taskId);
}

export async function kiePollOnce(taskId: string): Promise<KiePollResult> {
  const API_KEY = getKieApiKey();
  const res = await fetch(
    `${BASE_URL}/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`,
    {
      headers: { Authorization: `Bearer ${API_KEY}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return { state: "pending" };
  }

  const json = (await res.json()) as Record<string, unknown>;
  if (json.code !== undefined && json.code !== 200) {
    return { state: "pending" };
  }

  const data = json.data;
  if (!data || typeof data !== "object") {
    return { state: "pending" };
  }

  const d = data as Record<string, unknown>;
  const stateRaw = d.state ?? d.status;
  const state = String(stateRaw ?? "").toLowerCase();

  if (state === "success" || state === "completed" || state === "finished") {
    const url =
      parseResultUrlFromResultJson(d.resultJson) ??
      (typeof d.output === "object" && d.output !== null
        ? (d.output as { url?: string }).url
        : undefined) ??
      (Array.isArray(d.output) &&
      typeof d.output[0] === "object" &&
      d.output[0] !== null
        ? (d.output[0] as { url?: string }).url
        : undefined) ??
      (typeof d.imageUrl === "string" ? d.imageUrl : undefined) ??
      (typeof d.result_url === "string" ? d.result_url : undefined) ??
      (typeof d.output === "string" ? d.output : undefined);

    if (url && typeof url === "string") {
      return { state: "success", imageUrl: url };
    }
    return {
      state: "failed",
      failCode: null,
      failMsg: null,
      errorMessage: "Job finished but no image URL in response",
    };
  }

  if (state === "fail" || state === "failed" || state === "error") {
    return {
      state: "failed",
      failCode: d.failCode != null ? String(d.failCode) : null,
      failMsg: d.failMsg != null ? String(d.failMsg) : null,
    };
  }

  return { state: "pending" };
}
