'use client';

import { useEffect } from 'react';
import { auth } from '@/app/lib/firebase/client';

export function useAuthSync() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/; max-age=3600`;
      } else {
        // Clear cookie on logout
        document.cookie = 'token=; path=/; max-age=0';
      }
    });

    return () => unsubscribe();
  }, []);
}
