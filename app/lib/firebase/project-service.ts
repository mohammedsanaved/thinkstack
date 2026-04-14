import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';

import { db } from './client';

export async function createProject(userId: string, name: string, description: string) {
  const docRef = await addDoc(collection(db, 'projects'), {
    userId,
    name,
    description,
    createdAt: Date.now(),
  });

  return { id: docRef.id, name, description };
}

export async function updateProject(projectId: string, data: { name: string; description: string }) {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, data);
  return { id: projectId, ...data };
}

export async function deleteProject(projectId: string) {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
  return projectId;
}

export async function getUserProjects(userId: string) {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { name: string }),
  }));
}
