import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { db } from './client';

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  type: string;
  size: number;
  createdAt: number;
}

export async function addProjectFile(file: Omit<ProjectFile, 'id'>) {
  const docRef = await addDoc(collection(db, 'projectFiles'), file);
  return { id: docRef.id, ...file };
}

export async function getProjectFiles(projectId: string) {
  const q = query(
    collection(db, 'projectFiles'),
    where('projectId', '==', projectId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ProjectFile, 'id'>),
  }));
}

export async function deleteProjectFile(fileId: string) {
  await deleteDoc(doc(db, 'projectFiles', fileId));
}
