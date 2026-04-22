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
    <aside className='w-64 bg-[#0b0b10] border-r border-[#1e1e2e] p-4 flex flex-col gap-4'>
      <div className="px-2">
        <CreateProjectModal />
      </div>

      <div className='space-y-1 flex-1 overflow-y-auto custom-scrollbar'>
        {projects.map((project) => {
          const projectChats = chats.filter((c) => c.projectId === project.id);
          const isExpanded = expandedProject === project.id;

          return (
            <div key={project.id} className="space-y-1">
              {/* Project Item */}
              <div 
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer group ${
                  isExpanded ? 'bg-[#1e1e2e] text-[#89b4fa]' : 'text-[#9399b2] hover:bg-[#1e1e2e]/50 hover:text-[#cdd6f4]'
                }`}
              >
                <div
                  onClick={(e) => handleToggle(project.id, e)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isExpanded ? 'text-[#89b4fa]' : 'text-[#585b70] group-hover:text-[#89b4fa]'
                  }`}
                >
                  {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                </div>
                
                <span
                  onClick={() => handleProjectRedirect(project.id)}
                  className="flex-1 text-sm font-medium truncate"
                >
                  {project.name}
                </span>
              </div>

              {/* Chat Sub-items */}
              {isExpanded && (
                <div className='ml-4 pl-4 border-l border-[#1e1e2e] space-y-1 py-1'>
                  {projectChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() =>
                        router.push(`/dashboard/${project.id}/${chat.id}`)
                      }
                      className='flex items-center gap-2 text-[13px] px-3 py-1.5 rounded-lg text-[#6c7086] hover:bg-[#1e1e2e] hover:text-[#89b4fa] transition-all cursor-pointer group'
                    >
                      <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                  ))}

                  {projectChats.length === 0 && (
                    <p className='text-[11px] text-[#45475a] px-3 py-1 italic'>No chats yet</p>
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
