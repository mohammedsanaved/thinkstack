'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/layout/dashboard-layout';
import ChatInterface from '@/app/components/chat/chat-interface';

export default function ChatPage() {
  const { projectId, chat } = useParams();

  return (
    <DashboardLayout>
      <ChatInterface
        projectId={projectId as string}
        chatId={chat as string}
      />
    </DashboardLayout>
  );
}
