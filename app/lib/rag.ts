import { embed } from './embeddings/embedding';
import { getCollection } from './chroma/client';

export async function retrieveDocs(projectId: string, query: string) {
  const embedding = await embed(query);

  const collection = await getCollection(projectId);

  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
  });

  return results.documents?.[0] || [];
}
