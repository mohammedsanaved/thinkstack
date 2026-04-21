'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { getChatsByProject } from '@/app/lib/firebase/chat-service';

interface ProjectChatListProps {
  projectId: string;
}

export default function ProjectChatList({ projectId }: ProjectChatListProps) {
  const router = useRouter();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      try {
        const data = await getChatsByProject(projectId);
        setChats(data);
      } catch (err) {
        console.error('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-[#1e1e2e]/20 animate-pulse rounded-2xl border border-[#2a2a45]" />
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="mt-8 p-8 bg-[#1e1e2e]/40 border border-[#2a2a45] rounded-3xl flex flex-col items-center justify-center text-center">
        <p className="text-[#8b8b8b] text-lg">
          Start a chat to keep conversations organized and re-use project knowledge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-8 overflow-y-auto flex-1 pr-2 pb-4">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => router.push(`/dashboard/${projectId}/${chat.id}`)}
          className="group flex items-center justify-between p-6 bg-[#1e1e2e]/40 border rounded-3xl border-[#2a2a45] hover:border-[#89b4fa]/40 hover:bg-[#1e1e2e]/60 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#11111b] border border-[#2a2a45] text-[#89b4fa]">
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="text-white font-medium text-lg leading-tight mb-1">
                {chat.title}
              </h4>
              <p className="text-[#8b8b8b] text-sm">
                Last active {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="text-[#8b8b8b] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
      ))}
    </div>
  );
}
