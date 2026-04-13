import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createHmac } from "crypto";
import { getUploadTokenSecret, verifyUploadToken } from "./lib";

function bearerToken(request: NextRequest): string | null {
  const h = request.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7).trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    let secret: string;
    try {
      secret = getUploadTokenSecret();
    } catch {
      return NextResponse.json(
        { error: "Upload unavailable" },
        { status: 503 },
      );
    }

    const token = bearerToken(request);
    if (!token || !verifyUploadToken(token, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const buffer = await file.arrayBuffer();
    const fileHash = createHmac("sha256", secret)
      .update(Buffer.from(buffer))
      .digest("hex")
      .substring(0, 16);
    const filename = `${fileHash}-${timestamp}.${ext}`;

    const baseDir = process.env.RENDER ? "/var/data" : process.cwd();
    const uploadsDir = join(baseDir, "uploads");

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, Buffer.from(buffer));

    const fileUrl = `/api/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
