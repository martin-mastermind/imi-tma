import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

const UPLOADS_DIR = process.env.RENDER
  ? "/var/data/uploads"
  : join(process.cwd(), "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

// Sanitize filename to prevent directory traversal
function sanitizeFilename(filename: string): string | null {
  const sanitized = filename
    .replace(/\0/g, "")
    .replace(/\.\.\//g, "")
    .replace(/\.\.\\/g, "")
    .split("/")
    .pop()
    ?.split("\\")
    .pop();

  if (!sanitized || /^\./.test(sanitized)) {
    return null;
  }

  return sanitized;
}

function getMimeType(filename: string): string {
  const ext = filename.match(/\.[^.]+$/)?.[0]?.toLowerCase() || "";
  return MIME_TYPES[ext] || "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename?: string }> },
) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams?.filename) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filename = sanitizeFilename(resolvedParams.filename);

    if (!filename) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Safely resolve path and prevent directory traversal
    const filepath = resolve(UPLOADS_DIR, filename);
    if (!filepath.startsWith(resolve(UPLOADS_DIR))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read and return the file
    const buffer = await readFile(filepath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
