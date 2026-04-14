import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { db } from './client';

export async function addMessage({
  chatId,
  projectId,
  role,
  content,
}: {
  chatId: string;
  projectId: string;
  role: 'user' | 'assistant';
  content: string;
}) {
  await addDoc(collection(db, 'messages'), {
    chatId,
    projectId,
    role,
    content,
    createdAt: Date.now(),
  });
}

export async function getMessages(chatId: string) {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => doc.data());
}
