'use client';

import { useState, useCallback } from 'react';
import Header from './header';
import Sidebar from './sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className='h-screen flex flex-col bg-[#0b0b10] text-[#cdd6f4]'>
      <Header onMenuToggle={openSidebar} />

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        <main className='flex-1 h-auto'>{children}</main>
      </div>
    </div>
  );
}
