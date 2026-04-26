import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token?.trim()) throw new Error("TELEGRAM_BOT_TOKEN not configured");
  return token.trim();
}

function validateInitData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;
  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
  } catch {
    return false;
  }
}

function parseChatId(initData: string): number | null {
  const params = new URLSearchParams(initData);
  const chatRaw = params.get("chat");
  if (chatRaw) {
    try {
      const chat = JSON.parse(chatRaw) as { id?: number };
      if (typeof chat.id === "number") return chat.id;
    } catch { /* ignore */ }
  }
  const userRaw = params.get("user");
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw) as { id?: number };
      if (typeof user.id === "number") return user.id;
    } catch { /* ignore */ }
  }
  return null;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { initData, imageUrl } = (body ?? {}) as Record<string, unknown>;

  if (typeof initData !== "string" || !initData.trim())
    return NextResponse.json({ error: "initData required" }, { status: 400 });
  if (typeof imageUrl !== "string" || !imageUrl.startsWith("https://"))
    return NextResponse.json({ error: "imageUrl required" }, { status: 400 });

  let botToken: string;
  try { botToken = getBotToken(); } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  if (!validateInitData(initData, botToken))
    return NextResponse.json({ error: "Invalid initData" }, { status: 403 });

  const chatId = parseChatId(initData);
  if (!chatId)
    return NextResponse.json({ error: "Cannot determine chat_id" }, { status: 400 });

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo: imageUrl }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Telegram sendPhoto failed:", res.status, text);
    return NextResponse.json({ error: "Telegram API error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
