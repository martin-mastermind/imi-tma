import { createHmac, timingSafeEqual } from "crypto";

const UPLOAD_TOKEN_TTL_MS = 120_000;

export function createUploadToken(secret: string): string {
  const ts = Date.now().toString(36);
  const sig = createHmac("sha256", secret).update(ts).digest("base64url");
  return `${ts}.${sig}`;
}

export function verifyUploadToken(token: string, secret: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [ts, sig] = parts;
  if (!ts || !sig) return false;

  const t = parseInt(ts, 36);
  if (Number.isNaN(t)) return false;
  const skew = Date.now() - t;
  if (skew > UPLOAD_TOKEN_TTL_MS || skew < -60_000) return false;

  const expected = createHmac("sha256", secret).update(ts).digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getUploadTokenSecret(): string {
  const s =
    process.env.UPLOAD_TOKEN_SECRET?.trim() ||
    process.env.UPLOAD_SECRET?.trim();
  if (s) return s;
  throw new Error("UPLOAD_TOKEN_SECRET is not configured");
}
