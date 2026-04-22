'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Star, Edit2, Trash2, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditProjectModal from './edit-project-modal';
import DeleteProjectDialog from './delete-project-dialog';

interface ProjectHeaderProps {
  id: string;
  name: string;
  description?: string;
  onOpenDrawer: () => void;
}

export default function ProjectHeader({ id, name, description, onOpenDrawer }: ProjectHeaderProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-[#8b8b8b] hover:text-white transition-colors text-sm group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          All projects
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* Responsive title: text-2xl mobile, text-3xl tablet, text-4xl desktop */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-1 md:mb-2 truncate">
              {name}
            </h1>
            <p className="text-[#8b8b8b] text-base lg:text-lg truncate">
              {description || 'Description Not Added'}
            </p>
          </div>

          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {/* Files & Instructions drawer trigger — only on mobile/tablet */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenDrawer}
              className="lg:hidden text-[#8b8b8b] hover:text-[#89b4fa] hover:bg-[#89b4fa]/10 cursor-pointer"
              title="Files & Instructions"
            >
              <PanelRight size={20} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#8b8b8b] hover:text-white hover:bg-white/5 cursor-pointer">
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0b0b10] border-[#1e1e2e] text-[#cdd6f4]">
                <DropdownMenuItem
                  onClick={() => setShowEditModal(true)}
                  className="gap-2 cursor-pointer focus:bg-[#1e1e2e] focus:text-[#89b4fa]"
                >
                  <Edit2 size={14} />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2 cursor-pointer text-[#f38ba8] focus:bg-[#f38ba8]/10 focus:text-[#f38ba8]"
                >
                  <Trash2 size={14} className='text-[#f38ba8]' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-[#8b8b8b] hover:text-white hover:bg-white/5 cursor-pointer">
              <Star size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProjectModal
        project={{ id, name, description }}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
      <DeleteProjectDialog
        projectId={id}
        projectName={name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
