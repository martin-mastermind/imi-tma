import { NextResponse } from "next/server";
import { createUploadToken, getUploadTokenSecret } from "../lib";

export async function GET() {
  try {
    const secret = getUploadTokenSecret();
    const token = createUploadToken(secret);
    return NextResponse.json({ token });
  } catch (e) {
    console.error("upload token:", e);
    return NextResponse.json({ error: "Upload unavailable" }, { status: 503 });
  }
}
