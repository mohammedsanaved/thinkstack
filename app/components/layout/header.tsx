'use client';

import Image from 'next/image';
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
    <div className='h-16 flex items-center justify-between px-6 border-b border-[#1e1e2e] bg-[#11111b]/50 backdrop-blur-md'>
      <div className='flex items-center gap-3'>
        <Image
          src="/thinkstack_logo_1024.png"
          alt="Logo"
          width={32}
          height={32}
        />
        <h1 className='text-xl font-bold bg-gradient-to-r from-[#89b4fa] to-[#74c7ec] bg-clip-text text-transparent'>
          ThinkStack
        </h1>
      </div>
      <div className='flex items-center gap-4'>
        <span className='text-sm text-[#9399b2] font-medium'>{user?.email || 'User'}</span>

        <button
          onClick={handleLogout}
          className='text-sm text-[#f38ba8] hover:bg-[#f38ba8]/10 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer'
        >
          Logout
        </button>
      </div>
    </div>
  );
}
