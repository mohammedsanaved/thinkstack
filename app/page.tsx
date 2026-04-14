'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Root Switcher:
 * Redirects the user to /dashboard if logged in, or /login if not.
 * Because Firebase initialization takes a split second, we handle this
 * on the client to avoid "fake" logouts on hard reload.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check for cookie as a fast pass
    const hasToken = document.cookie.includes('token=');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard');
      } else if (!hasToken) {
        // Only redirect to login if we definitely don't have a token cookie
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        <p className='text-sm text-muted-foreground animate-pulse'>
          Checking your session...
        </p>
      </div>
    </div>
  );
}
