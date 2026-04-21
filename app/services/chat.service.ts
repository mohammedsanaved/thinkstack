// Replace with Firebase logic

import { embedBatch } from "@/app/lib/embeddings/embedding";
import { addMemory } from "@/app/lib/chroma/client";


export async function getRecentMessages(chatId: string) {
  // TODO: Fetch last 5–10 messages from Firebase
  return 'Previous conversation...';
}

export async function saveMessage(
  chatId: string,
  userMessage: string,
  aiResponse: string,
) {
  // TODO: Save to Firebase
  console.log({ chatId, userMessage, aiResponse });
}

export async function storeChatMemory({
  userId,
  projectId,
  chatId,
  userMessage,
  aiResponse,
}: {
  userId: string;
  projectId: string;
  chatId: string;
  userMessage: string;
  aiResponse: string;
}) {
  const texts = [
    `User: ${userMessage}`,
    `AI: ${aiResponse}`,
  ];

  const embeddings = await embedBatch(texts);

  const metadatas = texts.map((_, i) => ({
    userId,
    projectId,
    chatId,
    type: "chat",

    wing: projectId,
    room: chatId,
    drawer: `msg-${Date.now()}-${i}`,

    createdAt: Date.now(),
  }));

  await addMemory({
    projectId,
    texts,
    embeddings,
    metadatas,
  });
}