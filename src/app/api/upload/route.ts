import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createHmac } from 'crypto';

// Verify API key for security
function verifyApiKey(token: string | null): boolean {
  const apiKey = process.env.NEXT_PUBLIC_UPLOAD_API_KEY;
  if (!apiKey) {
    console.warn('NEXT_PUBLIC_UPLOAD_API_KEY not set - uploads require valid API key');
    return false;
  }
  return token === apiKey;
}

// Verify request signature using HMAC
function verifySignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const computed = createHmac('sha256', secret).update(body).digest('hex');
  return computed === signature;
}

export async function POST(request: NextRequest) {
  try {
    // Security: Verify API key
    const apiKey = request.headers.get('x-api-key');
    if (!verifyApiKey(apiKey)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (30MB max)
    const maxSize = 30 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Generate cryptographically secure filename using hash
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const buffer = await file.arrayBuffer();
    const fileHash = createHmac('sha256', process.env.UPLOAD_SECRET || 'default-secret')
      .update(Buffer.from(buffer))
      .digest('hex')
      .substring(0, 16);
    const filename = `${fileHash}-${timestamp}.${ext}`;

    // Save to Render persistent disk (/var/data) or fallback to public/uploads
    const baseDir = process.env.RENDER ? '/var/data' : process.cwd();
    const uploadsDir = join(baseDir, 'uploads');

    // Ensure directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, Buffer.from(buffer));

    // Return URL that can be accessed via the API route
    const fileUrl = `/api/uploads/${filename}`;

    return NextResponse.json({
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
