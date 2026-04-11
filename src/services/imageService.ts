import type { AspectRatio, Resolution } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_KIE_API_KEY!;
const BASE_URL = 'https://api.kie.ai/api/v1';

/** Thrown when KIE recordInfo reports a failed job (failCode / failMsg). */
export class KieJobFailedError extends Error {
  readonly failCode: string | null;
  readonly failMsg: string | null;

  constructor(failCode: string | null, failMsg: string | null) {
    const message =
      (typeof failMsg === 'string' && failMsg.trim()) ||
      (failCode != null && String(failCode).trim()) ||
      'Generation failed';
    super(message);
    this.name = 'KieJobFailedError';
    this.failCode = failCode;
    this.failMsg = failMsg;
  }
}

function parseResultUrlFromResultJson(resultJson: unknown): string | undefined {
  if (typeof resultJson !== 'string' || !resultJson.trim()) return undefined;
  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: unknown };
    const urls = parsed.resultUrls;
    if (Array.isArray(urls) && urls.length > 0 && typeof urls[0] === 'string') {
      return urls[0];
    }
  } catch {
    /* ignore malformed JSON */
  }
  return undefined;
}

export async function createTask(
  prompt: string,
  aspectRatio: AspectRatio,
  resolution: Resolution = '1K',
  imageInputs: string[] = [],
): Promise<string> {
  const body: Record<string, unknown> = {
    model: 'nano-banana-2',
    input: {
      prompt: prompt.trim(),
      aspect_ratio: aspectRatio,
      resolution: resolution,
      output_format: 'jpg',
      ...(imageInputs.length > 0 ? { image_input: imageInputs } : {}),
    },
  };

  const res = await fetch(`${BASE_URL}/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  const taskId = json?.data?.taskId ?? json?.data?.task_id ?? json?.taskId;
  if (!taskId) throw new Error('No taskId in response');
  return String(taskId);
}

export async function pollJobStatus(taskId: string): Promise<string> {
  const maxAttempts = 120; // 4 minutes (2 seconds * 120)

  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }

    const res = await fetch(`${BASE_URL}/jobs/recordInfo?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!res.ok) continue;
    const json = await res.json();
    if (json?.code !== undefined && json.code !== 200) continue;

    const data = json?.data;
    if (!data || typeof data !== 'object') continue;

    const stateRaw = (data as { state?: unknown; status?: unknown }).state
      ?? (data as { status?: unknown }).status;
    const state = String(stateRaw ?? '').toLowerCase();

    if (state === 'success' || state === 'completed' || state === 'finished') {
      const d = data as Record<string, unknown>;
      const url =
        parseResultUrlFromResultJson(d.resultJson)
        ?? (typeof d.output === 'object' && d.output !== null
          ? (d.output as { url?: string; [key: string]: unknown }).url
          : undefined)
        ?? (Array.isArray(d.output) && typeof d.output[0] === 'object' && d.output[0] !== null
          ? (d.output[0] as { url?: string }).url
          : undefined)
        ?? (typeof d.imageUrl === 'string' ? d.imageUrl : undefined)
        ?? (typeof d.result_url === 'string' ? d.result_url : undefined)
        ?? (typeof d.output === 'string' ? d.output : undefined);
      if (url && typeof url === 'string') return url;
      throw new Error('Job finished but no image URL in response');
    }

    if (state === 'fail' || state === 'failed' || state === 'error') {
      const d = data as { failCode?: unknown; failMsg?: unknown };
      throw new KieJobFailedError(
        d.failCode != null ? String(d.failCode) : null,
        d.failMsg != null ? String(d.failMsg) : null,
      );
    }
  }
  throw new Error('Timeout: generation took too long');
}

export function validateImageFile(file: File): void {
  if (file.size > 30 * 1024 * 1024) throw new Error('File too large (max 30MB)');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Only JPEG, PNG, and WebP allowed');
}

export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_UPLOAD_API_KEY || '',
    },
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const json = await res.json();
  if (!json.url) throw new Error('No URL in upload response');
  return json.url;
}
