import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  doc,
} from 'firebase/firestore';

import { db } from './client';

export async function createChat(projectId: string, title: string) {
  const docRef = await addDoc(collection(db, 'chats'), {
    projectId,
    title,
    createdAt: Date.now(),
  });

  return { id: docRef.id, projectId, title };
}

export async function getChatsByProject(projectId: string) {
  const q = query(
    collection(db, 'chats'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { title: string; projectId: string }),
  }));
}

export async function getChat(chatId: string) {
  const docRef = doc(db, 'chats', chatId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...(docSnap.data() as { title: string; projectId: string }),
    };
  }
  return null;
}
