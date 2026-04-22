'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Star, Edit2, Trash2 } from 'lucide-react';
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
}

export default function ProjectHeader({ id, name, description }: ProjectHeaderProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-[#8b8b8b] hover:text-white transition-colors text-sm group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          All projects
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">
              {name}
            </h1>
            <p className="text-[#8b8b8b] text-lg">
              {description || 'Description Not Added'}
            </p>
          </div>

          <div className="flex items-center gap-2">
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
