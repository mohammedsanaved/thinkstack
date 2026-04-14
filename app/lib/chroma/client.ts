import { ChromaClient } from 'chromadb';
import { ENV } from '@/config/env';

const client = new ChromaClient({
  path: ENV.CHROMA_URL,
});

export async function getCollection(projectId: string) {
  return client.getOrCreateCollection({
    name: `project_${projectId}`,
  });
}
