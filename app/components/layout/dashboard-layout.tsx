'use client';

import Header from './header';
import Sidebar from './sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-screen flex flex-col bg-[#0b0b10] text-[#cdd6f4]'>
      <Header />

      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />

        <main className='flex-1 h-auto'>{children}</main>
      </div>
    </div>
  );
}
