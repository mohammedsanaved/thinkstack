'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { auth } from '@/app/lib/firebase/client';
import { createProject } from '@/app/lib/firebase/project-service';
import { useProjectStore } from '@/store/store';

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const router = useRouter();
  const addProject = useProjectStore((s) => s.addProject);

  const handleCreate = async () => {
    if (!name) return;

    const user = auth.currentUser;
    if (!user) return;

    const project = await createProject(user.uid, name, description);

    addProject(project);

    setOpen(false);
    setName('');
    setDescription('');

    // 🔥 Redirect to chat page
    router.push(`/dashboard/${project.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-full mb-4'>+ New Project</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <Input
            placeholder='Project name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder='Project Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button className='w-full cursor-pointer' onClick={handleCreate}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
