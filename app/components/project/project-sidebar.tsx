'use client';

import { Lock, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectSidebar() {
  return (
    <aside className="w-[380px] flex flex-col gap-6">
      {/* Memory Section */}
      <div className="bg-[#1e1e2e]/40 border border-[#2a2a45] rounded-3xl p-6 transition-colors hover:border-[#89b4fa]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium text-lg">Memory</h3>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#8b8b8b] text-xs">
            <Lock size={12} />
            Only you
          </div>
        </div>
        <p className="text-[#8b8b8b] text-sm leading-relaxed">
          Project memory will show here after a few chats.
        </p>
      </div>

      {/* Instructions Section */}
      <div className="bg-[#1e1e2e]/40 border border-[#2a2a45] rounded-3xl p-6 transition-colors hover:border-[#89b4fa]/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium text-lg">Instructions</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#8b8b8b] hover:text-white hover:bg-white/5">
            <Plus size={20} />
          </Button>
        </div>
        <p className="text-[#8b8b8b] text-sm leading-relaxed">
          Add instructions to tailor ThinkStack responses
        </p>
      </div>

      {/* Files Section */}
      <div className="bg-[#1e1e2e]/40 border border-[#2a2a45] rounded-3xl p-6 flex-1 flex flex-col transition-colors hover:border-[#89b4fa]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Files</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#8b8b8b] hover:text-white hover:bg-white/5">
            <Plus size={20} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#11111b]/50 rounded-2xl border border-dashed border-[#2a2a45]">
          <div className="relative mb-6">
            <div className="absolute -left-4 top-2 opacity-50"><FileText size={48} className="text-[#313149]" /></div>
            <div className="absolute -right-4 top-2 opacity-100"><FileText size={48} className="text-[#89b4fa]/50" /></div>
            <div className="relative z-10"><FileText size={48} className="text-white/20" /></div>
          </div>
          <p className="text-[#8b8b8b] text-sm leading-relaxed max-w-[200px]">
            Add PDFs, documents, or other text to reference in this project.
          </p>
        </div>
      </div>
    </aside>
  );
}
