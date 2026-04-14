'use client';

import { useEffect } from 'react';
import DashboardLayout from '@/app/components/layout/dashboard-layout';
import CreateProject from '@/app/components/project/create-project';
import PromptBox from '@/app/components/prompt/prompt-input';

import { useProjectStore } from '@/store/store';
import { getUserProjects } from '@/app/lib/firebase/project-service';
import { auth } from '@/app/lib/firebase/client';
import { useAuthSync } from '@/app/api/auth/authAsync';
import InputLayout from '../components/prompt/input-layout';

export default function DashboardPage() {
  const setProjects = useProjectStore((s) => s.setProjects);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const projects = await getUserProjects(user.uid);
        setProjects(projects);
      }
    });

    return () => unsubscribe();
  }, [setProjects]);
  useAuthSync();

  return (
    <DashboardLayout>
      {/* <CreateProject /> */}
      {/* <PromptBox /> */}
      <InputLayout />
    </DashboardLayout>
  );
}
