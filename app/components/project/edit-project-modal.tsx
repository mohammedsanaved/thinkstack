'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { updateProject } from '@/app/lib/firebase/project-service';
import { useProjectStore } from '@/store/store';

interface EditProjectModalProps {
  project: { id: string; name: string; description?: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProjectModal({ project, open, onOpenChange }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [loading, setLoading] = useState(false);

  const updateStoreProject = useProjectStore((s) => s.updateProject);

  useEffect(() => {
    setName(project.name);
    setDescription(project.description || '');
  }, [project]);

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const data = { name, description };
      await updateProject(project.id, data);
      updateStoreProject({ id: project.id, ...data });
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/70'>Project Name</label>
            <Input
              placeholder='Project name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-[#11111b] border-[#2a2a45] text-white'
            />
          </div>
          
          <div className='space-y-2'>
            <label className='text-sm font-medium text-white/70'>Description</label>
            <Input
              placeholder='Project description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='bg-[#11111b] border-[#2a2a45] text-white'
            />
          </div>

          <Button 
            className='w-full cursor-pointer bg-[#89b4fa] text-[#11111b] hover:bg-[#b4d0fa]' 
            onClick={handleUpdate}
            disabled={loading || !name.trim()}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
