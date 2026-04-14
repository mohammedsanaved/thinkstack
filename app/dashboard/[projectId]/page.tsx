'use client';

import { useParams } from 'next/navigation';
import DashboardLayout from '@/app/components/layout/dashboard-layout';
import ProjectOverview from '@/app/components/project/project-overview';

export default function ProjectPage() {
  const { projectId } = useParams();

  return (
    <DashboardLayout>
      <ProjectOverview projectId={projectId as string} />
    </DashboardLayout>
  );
}
