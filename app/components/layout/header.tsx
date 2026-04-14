'use client';

import { auth } from '../../lib/firebase/client';
import { signOut } from 'firebase/auth';

export default function Header() {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  return (
    <div className='h-16 flex items-center justify-between px-6 border-b bg-white'>
      <h1 className='text-xl font-semibold'>ThinkStack</h1>

      <div className='flex items-center gap-4'>
        <span className='text-sm'>{user?.email || 'User'}</span>

        <button onClick={handleLogout} className='text-sm text-red-500'>
          Logout
        </button>
      </div>
    </div>
  );
}
