import { NextRequest, NextResponse } from 'next/server';

function isAllowedImageUrl(url: URL, requestHost: string | undefined): boolean {
  if (url.protocol !== 'https:') return false;

  const extra = process.env.CLIPBOARD_IMAGE_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean) ?? [];

  const allowed = new Set([
    'tempfile.aiquickdraw.com',
    ...extra,
  ]);

  if (allowed.has(url.hostname)) return true;

  if (requestHost && url.hostname === requestHost) return true;

  const self = process.env.NEXT_PUBLIC_APP_ORIGIN
    ? new URL(process.env.NEXT_PUBLIC_APP_ORIGIN).hostname
    : null;
  if (self && url.hostname === self) return true;

  return false;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  const requestHost = request.headers.get('host')?.split(':')[0];
  if (!isAllowedImageUrl(target, requestHost)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(target.href, {
      headers: { Accept: 'image/*,*/*' },
      next: { revalidate: 0 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Upstream failed' }, { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Not an image' }, { status: 415 });
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }
}
