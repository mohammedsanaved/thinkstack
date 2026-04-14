import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/chroma/client';
import { embedBatch } from '@/app/lib/embeddings/embedding';
import { chunkText } from '@/app/lib/utils/chunkText';

export async function POST(req: NextRequest) {
  try {
    const { projectId, text } = await req.json();

    const chunks = chunkText(text);

    const embeddings = await embedBatch(chunks);

    const collection = await getCollection(projectId);

    await collection.add({
      ids: chunks.map((_, i) => `${projectId}-${Date.now()}-${i}`),
      documents: chunks,
      embeddings,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
