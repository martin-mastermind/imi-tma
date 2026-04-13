import { NextRequest, NextResponse } from "next/server";
import { kiePollOnce } from "../../lib";

const TASK_ID_RE = /^[a-zA-Z0-9._-]{1,256}$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ taskId?: string }> },
) {
  const { taskId: raw } = await params;
  if (!raw || !TASK_ID_RE.test(raw)) {
    return NextResponse.json({ error: "Invalid taskId" }, { status: 400 });
  }

  try {
    const result = await kiePollOnce(raw);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Poll failed";
    if (message.includes("KIE_API_KEY")) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 },
      );
    }
    console.error("kie poll:", e);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
