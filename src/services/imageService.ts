import type { AspectRatio, Resolution } from "@/types";

/** Thrown when KIE recordInfo reports a failed job (failCode / failMsg). */
export class KieJobFailedError extends Error {
  readonly failCode: string | null;
  readonly failMsg: string | null;

  constructor(failCode: string | null, failMsg: string | null) {
    const message =
      (typeof failMsg === "string" && failMsg.trim()) ||
      (failCode != null && String(failCode).trim()) ||
      "Generation failed";
    super(message);
    this.name = "KieJobFailedError";
    this.failCode = failCode;
    this.failMsg = failMsg;
  }
}

type KiePollJson = {
  state: "pending" | "success" | "failed";
  imageUrl?: string;
  failCode?: string | null;
  failMsg?: string | null;
  errorMessage?: string;
};

export async function createTask(
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution = "1K",
  imageInputs: string[] = [],
): Promise<string> {
  const res = await fetch("/api/kie/create-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      aspectRatio,
      resolution,
      imageInputs,
    }),
  });

  const json = (await res.json().catch(() => ({}))) as {
    taskId?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(
      typeof json.error === "string" ? json.error : `API error ${res.status}`,
    );
  }
  if (!json.taskId) throw new Error("No taskId in response");
  return json.taskId;
}

export async function pollJobStatus(taskId: string): Promise<string> {
  const maxAttempts = 120;

  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }

    const res = await fetch(`/api/kie/task/${encodeURIComponent(taskId)}`, {
      cache: "no-store",
    });
    if (!res.ok) continue;

    const json = (await res.json().catch(() => null)) as KiePollJson | null;
    if (!json || typeof json.state !== "string") continue;

    if (json.state === "success" && json.imageUrl) {
      return json.imageUrl;
    }

    if (json.state === "failed") {
      if (typeof json.errorMessage === "string" && json.errorMessage.trim()) {
        throw new Error(json.errorMessage.trim());
      }
      throw new KieJobFailedError(
        json.failCode != null ? String(json.failCode) : null,
        json.failMsg != null ? String(json.failMsg) : null,
      );
    }
  }
  throw new Error("Timeout: generation took too long");
}

export function validateImageFile(file: File): void {
  if (file.size > 30 * 1024 * 1024)
    throw new Error("File too large (max 30MB)");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP allowed");
  }
}

export async function uploadImageFile(file: File): Promise<string> {
  const tokenRes = await fetch("/api/upload/token");
  if (!tokenRes.ok) {
    throw new Error("Could not prepare upload");
  }
  const { token } = (await tokenRes.json()) as { token?: string };
  if (!token) throw new Error("No upload token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new Error("No URL in upload response");
  return json.url;
}
