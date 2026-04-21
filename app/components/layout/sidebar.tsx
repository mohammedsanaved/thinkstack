'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useProjectStore } from '@/store/store';
import { useChatStore } from '@/store/chat-store';

import { getChatsByProject } from '@/app/lib/firebase/chat-service';
import CreateProjectModal from '@/app/components/project/create-project-modal';
import { Folder, FolderOpen, MessageSquare } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const { projects } = useProjectStore();
  const { chats, setChats } = useChatStore();

  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // 🔥 Toggle project expansion (only opens chats)
  const handleToggle = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering parent click if any

    if (expandedProject === projectId) {
      setExpandedProject(null);
      return;
    }

    setExpandedProject(projectId);

    // Fetch and sync chats for this project
    const projectChats = await getChatsByProject(projectId);
    setChats(projectChats);
  };

  // 🔥 Redirect to project overview
  const handleProjectRedirect = (projectId: string) => {
    router.push(`/dashboard/${projectId}`);
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
              <div className='flex gap-2 items-center p-2 rounded hover:bg-gray-100 font-medium group transition-colors'>
                <div
                  onClick={(e) => handleToggle(project.id, e)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {expandedProject === project.id ? (
                    <FolderOpen size={18} />
                  ) : (
                    <Folder size={18} />
                  )}
                </div>
                <span
                  onClick={() => handleProjectRedirect(project.id)}
                  className="cursor-pointer flex-1 hover:text-[#89b4fa] transition-colors"
                >
                  {project.name}
                </span>
              </div>
              {/* Chats */}
              {expandedProject === project.id && (
                <div className='ml-4 mt-1 cursor-pointer'>
                  {projectChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() =>
                        router.push(`/dashboard/${project.id}/${chat.id}`)
                      }
                      className='flex gap-2 text-sm p-1 rounded hover:bg-gray-100 cursor-pointer'
                    >
                      <MessageSquare size={18} />{chat.title}
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
