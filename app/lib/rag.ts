import { embed } from './embeddings/embedding';
import { getCollection } from './chroma/client';

export async function retrieveMemory({
  projectId,
  query,
  filter,
  nResults = 8,
}: {
  projectId: string;
  query: string;
  filter?: Record<string, any>;
  nResults?: number;
}) {
  try {
    const embedding = await embed(query);
    const collection = await getCollection(projectId);

    const results = await collection.query({
      queryEmbeddings: [embedding],
      nResults,
      // where: filter,
    });

    const docs = results.documents?.[0] || [];
    const distances = results.distances?.[0] || [];

    const ranked = docs.map((doc, i) => ({
      content: doc,
      score: distances[i] ?? 0,
    }));

    // Sort by relevance (lower distance = better)
    ranked.sort((a, b) => a.score - b.score);

    console.log(`🔍 RAG: Found ${ranked.length} memories (filter: ${JSON.stringify(filter)})`);

    return ranked;
  } catch (error) {
    console.error("RAG Error:", error);
    return [];
  }
}

export async function buildContext({
  projectId,
  chatId,
  query,
}: {
  projectId: string;
  chatId: string;
  query: string;
}) {
  // Fetch file chunks and chat memories separately with type filters
  const [fileMemory, chatMemory] = await Promise.all([
    retrieveMemory({
      projectId,
      query,
      filter: { type: "file" },
      nResults: 8,
    }),
    retrieveMemory({
      projectId,
      query,
      filter: { type: "chat", room: chatId },
      nResults: 5,
    }),
  ]);

  const projectMemory = fileMemory.map(m => m.content as string);
  const chatMemoryStrings = chatMemory.map(m => m.content as string);

  return {
    chatMemory: chatMemoryStrings,
    projectMemory,
  };
}