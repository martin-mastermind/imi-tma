import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Prevent directory traversal attacks
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Read from Render persistent disk (/var/data) or fallback to public/uploads
    const baseDir = process.env.RENDER ? '/var/data' : process.cwd();
    const uploadsDir = join(baseDir, 'uploads');
    const filepath = join(uploadsDir, filename);

    console.log('Serving file:', { filename, baseDir, uploadsDir, filepath, exists: existsSync(filepath) });

    // Check if file exists
    if (!existsSync(filepath)) {
      console.warn('File not found:', filepath);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Get file stats for logging
    const stats = statSync(filepath);
    console.log('File stats:', { size: stats.size, isFile: stats.isFile() });

    // Read and return the file
    const buffer = await readFile(filepath);

    // Determine content type from file extension
    const ext = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'webp') contentType = 'image/webp';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file', details: String(error) }, { status: 500 });
  }
}
