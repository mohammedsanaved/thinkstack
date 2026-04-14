'use client';

import { useState } from 'react';
import { auth } from '@/app/lib/firebase/client';
import { createProject } from '@/app/lib/firebase/project-service';
import { useProjectStore } from '@/store/store';

export default function CreateProject() {
  const [projectName, setProjectName] = useState('');

  const addProject = useProjectStore((s) => s.addProject);

  const handleCreate = async () => {
    if (!projectName) return;

    const user = auth.currentUser;
    if (!user) return;

    const project = await createProject(user.uid, projectName);

    addProject(project); // 🔥 sync UI instantly

    setProjectName('');
  };

  return (
    <div className='bg-green-100 border rounded-xl p-6 mb-6'>
      <h2 className='text-lg font-semibold mb-4'>
        Create a new Learning Project
      </h2>

      <div className='flex gap-2'>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder='Enter project name'
          className='flex-1 p-2 border rounded'
        />

        <button
          onClick={handleCreate}
          className='bg-green-500 text-white px-4 rounded'
        >
          Create
        </button>
      </div>
    </div>
  );
}
