'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteProject } from '@/app/lib/firebase/project-service';
import { useProjectStore } from '@/store/store';

interface DeleteProjectDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteProjectDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const removeProjectFromStore = useProjectStore((s) => s.deleteProject);

  console.log(projectName, "projectName")

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProject(projectId);
      removeProjectFromStore(projectId);
      onOpenChange(false);
      // 🔥 Redirect to dashboard after deletion
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription className="text-[#8b8b8b]">
            Are you sure you want to delete <span className="text-black font-bold">{projectName}</span>?
            This action cannot be undone and will permanently remove all project data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-1">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="text-black cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
