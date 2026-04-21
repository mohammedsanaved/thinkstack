import { ChromaClient } from 'chromadb';
import { ENV } from '@/config/env';

// const chromaUrl = new URL(ENV.CHROMA_URL.startsWith('http') ? ENV.CHROMA_URL : `http://${ENV.CHROMA_URL}`);

const client = new ChromaClient({
  path: ENV.CHROMA_URL, // e.g. "http://localhost:8000"
});


export async function getCollection(projectId: string) {
  return client.getOrCreateCollection({
    name: `project_${projectId}`,
    embeddingFunction: undefined, 
  });
}
export async function addMemory({
  projectId,
  texts,
  embeddings,
  metadatas,
}: {
  projectId: string;
  texts: string[];
  embeddings: number[][];
  metadatas: any[];
}) {
  const collection = await getCollection(projectId);

  await collection.add({
    ids: texts.map((_, i) => `${projectId}-${Date.now()}-${i}`),
    documents: texts,
    embeddings,
    metadatas,
  });
}

export async function deleteMemory(projectId: string, filter: any) {
  const collection = await getCollection(projectId);
  await collection.delete({ where: filter });
}
