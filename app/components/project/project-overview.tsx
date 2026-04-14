'use client';

import { useState, useEffect } from 'react';
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

  const handleSend = async (prompt: string, files: any[]) => {
    // Create a new chat for this project
    const title = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
    const chat = await createChat(projectId, title);
    router.push(`/dashboard/${projectId}/${chat.id}`);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#11111b] p-8 flex items-center justify-center">
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
    <div className="flex-1 bg-[#11111b] overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10 flex gap-12">
        <div className="flex-1 flex flex-col">
          <ProjectHeader 
            id={project.id}
            name={project.name} 
            description={project.description} 
          />
          
          <div className="max-w-[800px]">
            <ProjectInput onSend={handleSend} />
            <ProjectChatList projectId={projectId} />
          </div>
        </div>

        <ProjectSidebar />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes chip-in {
          from { opacity: 0; transform: scale(0.85) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-chip-in { animation: chip-in 0.18s ease-out both; }
        
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  );
}
