'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useProjectStore } from '@/store/store';
import { useChatStore } from '@/store/chat-store';

import { getChatsByProject } from '@/app/lib/firebase/chat-service';
import CreateProjectModal from '@/app/components/project/create-project-modal';
import { Folder, FolderOpen, MessageSquare, X } from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
    onClose(); // Close drawer on mobile after navigation
  };

  // Navigate to a chat and close drawer on mobile
  const handleChatRedirect = (projectId: string, chatId: string) => {
    router.push(`/dashboard/${projectId}/${chatId}`);
    onClose();
  };

  /* ─── Shared sidebar content (used by all breakpoints) ─── */
  const sidebarContent = (
    <>
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
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isExpanded ? 'text-[#89b4fa]' : 'text-[#585b70] group-hover:text-[#89b4fa]'
                  }`}
                >
                  {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                </div>

                {/* Project name — hidden in tablet collapsed rail, visible everywhere else */}
                <span
                  onClick={() => handleProjectRedirect(project.id)}
                  className="flex-1 text-sm font-medium truncate sidebar-label"
                >
                  {project.name}
                </span>
              </div>

              {/* Chat Sub-items — only show when expanded AND labels are visible */}
              {isExpanded && (
                <div className='ml-4 pl-4 border-l border-[#1e1e2e] space-y-1 py-1 sidebar-label'>
                  {projectChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatRedirect(project.id, chat.id)}
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
    </>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          MOBILE (< 768px) — Drawer overlay with backdrop
         ════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-[#0b0b10] border-r border-[#1e1e2e] p-4 flex flex-col gap-4 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-[#89b4fa]">Projects</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9399b2] hover:bg-[#1e1e2e] hover:text-[#cdd6f4] transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {sidebarContent}
      </aside>

      {/* ════════════════════════════════════════════════════════
          TABLET (768px–1024px) — Collapsed icon rail, expands on hover
         ════════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex lg:hidden flex-col gap-4 p-4 bg-[#0b0b10] border-r border-[#1e1e2e]
                   w-14 hover:w-64 transition-[width] duration-300 ease-in-out overflow-hidden group/rail shrink-0"
      >
        {/* CreateProjectModal — only visible when rail is expanded */}
        <div className="px-2 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-200">
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
                    className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                      isExpanded ? 'text-[#89b4fa]' : 'text-[#585b70] group-hover:text-[#89b4fa]'
                    }`}
                  >
                    {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
                  </div>

                  {/* Name — hidden until rail hovers */}
                  <span
                    onClick={() => handleProjectRedirect(project.id)}
                    className="flex-1 text-sm font-medium truncate opacity-0 group-hover/rail:opacity-100 transition-opacity duration-200"
                  >
                    {project.name}
                  </span>
                </div>

                {/* Chat Sub-items — only when expanded AND rail is hovered */}
                {isExpanded && (
                  <div className='ml-4 pl-4 border-l border-[#1e1e2e] space-y-1 py-1 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-200'>
                    {projectChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatRedirect(project.id, chat.id)}
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

      {/* ════════════════════════════════════════════════════════
          DESKTOP (> 1024px) — Full sidebar, always visible
         ════════════════════════════════════════════════════════ */}
      <aside className='hidden lg:flex w-64 bg-[#0b0b10] border-r border-[#1e1e2e] p-4 flex-col gap-4 shrink-0'>
        {sidebarContent}
      </aside>
    </>
  );
}
