'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useProjectStore } from '@/store/store';
import { useChatStore } from '@/store/chat-store';

import { getChatsByProject } from '@/app/lib/firebase/chat-service';
import CreateProjectModal from '@/app/components/project/create-project-modal';
import { Folder, FolderOpen } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const { projects } = useProjectStore();
  const { chats, setChats } = useChatStore();

  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // 🔥 Load chats when project expands
  const handleToggle = async (projectId: string) => {
    router.push(`/dashboard/${projectId}`);

    if (expandedProject === projectId) {
      setExpandedProject(null);
      return;
    }

    setExpandedProject(projectId);

    const projectChats = await getChatsByProject(projectId);
    setChats(projectChats);
  };

  return (
    <aside className='w-64 bg-white border-r p-4 flex flex-col'>
      <CreateProjectModal />

      <div className='space-y-2 flex-1 overflow-y-auto'>
        {projects.map((project) => {
          const projectChats = chats.filter((c) => c.projectId === project.id);

          return (
            <div key={project.id}>
              {/* Project */}
              <div
                onClick={() => handleToggle(project.id)}
                className='flex gap-2 items-center p-2 rounded cursor-pointer hover:bg-gray-100 font-medium'
              >
                {expandedProject === project.id ? (
                  <FolderOpen size={18} />
                ) : (
                  <Folder size={18} />
                )}
                {project.name}
              </div>
              {/* Chats */}
              {expandedProject === project.id && (
                <div className='ml-4 mt-1 space-y-1'>
                  {projectChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() =>
                        router.push(`/dashboard/${project.id}/${chat.id}`)
                      }
                      className='text-sm p-1 rounded hover:bg-gray-100 cursor-pointer'
                    >
                      💬 {chat.title}
                    </div>
                  ))}

                  {projectChats.length === 0 && (
                    <p className='text-xs text-gray-400'>No chats yet</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
