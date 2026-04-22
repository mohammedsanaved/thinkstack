'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProjectHeader from './project-header';
import ProjectSidebar from './project-sidebar';
import ProjectChatList from './project-chat-list';
import ProjectInput from './project-input';
import { createChat } from '@/app/lib/firebase/chat-service';
import { db } from '@/app/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

interface ProjectOverviewProps {
  projectId: string;
}

export default function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    async function loadProject() {
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId]);

  const handleSend = async (prompt: string) => {
    setLoading(true);
    try {
      // Create a new chat for this project
      const title = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
      const chat = await createChat(projectId, title);

      // Add the initial message to Firebase
      const { addMessage } = await import('@/app/lib/firebase/message-service');
      await addMessage({
        chatId: chat.id,
        projectId,
        role: 'user',
        content: prompt,
      });

      // Redirect with a flag to trigger the AI response automatically
      router.push(`/dashboard/${projectId}/${chat.id}?auto=true`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#11111b] p-8 flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-[#89b4fa] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 bg-[#11111b] p-8 text-center text-white">
        Project not found.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#11111b] h-screen overflow-hidden flex flex-col pb-8">
      {/* Responsive container */}
      <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10 flex-1 flex flex-col min-h-0">
        <ProjectHeader
          id={project.id}
          name={project.name}
          description={project.description}
          onOpenDrawer={openDrawer}
        />

        {/* Desktop: two-column (chat + inline sidebar) | Mobile/Tablet: single column */}
        <div className="flex gap-12 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-h-0 max-w-[800px]">
            <ProjectInput onSend={handleSend} />
            <ProjectChatList projectId={projectId} />
          </div>

          {/* Inline sidebar — desktop only (>= 1024px) */}
          <ProjectSidebar
            projectId={projectId}
            isOpen={drawerOpen}
            onClose={closeDrawer}
          />
        </div>
      </div>

      <style>{`
        @keyframes chip-in {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-chip-in { animation: chip-in 0.18s ease-out both; }
      `}</style>
    </div>
  );
}
