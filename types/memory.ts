export type MemoryMetadata = {
  userId: string;
  projectId: string;
  chatId?: string;

  type: "chat" | "doc" | "note";

  // MemPalace structure
  wing: string;   // project
  room: string;   // topic
  drawer: string; // message id

  createdAt: number;
};