import { create } from 'zustand';

type Chat = {
  id: string;
  title: string;
  projectId: string;
};

type ChatStore = {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],

  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),
}));
