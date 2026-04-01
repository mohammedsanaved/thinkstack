import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // TODO:
  // 1. Convert message → embedding
  // 2. Search ChromaDB
  // 3. Send context + query to LLM
  // 4. Return response

  return NextResponse.json({
    reply: 'AI response will come here',
  });
}
