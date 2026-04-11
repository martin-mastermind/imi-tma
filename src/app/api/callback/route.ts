import { NextRequest, NextResponse } from 'next/server';

// Store results in memory (in production, use a database)
const resultStore = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const taskId = payload?.taskId || payload?.task_id || payload?.jobId || payload?.job_id || payload?.id;

    if (!taskId) {
      return NextResponse.json({ error: 'No taskId in callback' }, { status: 400 });
    }

    // Store the result
    resultStore.set(String(taskId), {
      status: 'completed',
      imageUrl: payload?.output?.url || payload?.output?.[0]?.url || payload?.imageUrl || payload?.result_url,
      payload,
      receivedAt: new Date().toISOString(),
    });

    console.log(`Callback received for task ${taskId}`);
    return NextResponse.json({ success: true, taskId });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}

// Endpoint to retrieve callback result
export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'No taskId provided' }, { status: 400 });
    }

    const result = resultStore.get(taskId);
    if (!result) {
      return NextResponse.json({ status: 'pending' }, { status: 202 });
    }

    // Clear from store after retrieval
    resultStore.delete(taskId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Callback GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve result' }, { status: 500 });
  }
}
