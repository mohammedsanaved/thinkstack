'use client';

import React, { useState } from 'react';
import CustomInput from './custom-input';
import { AttachedFile } from './prompt-helpers';
import Image from 'next/image';

export default function InputLayout() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<AttachedFile[]>([]);

  const handleGenerate = async (prompt: string, incomingFiles: AttachedFile[]) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setFiles(incomingFiles);

    // Simulate upload progress for demo
    for (const f of incomingFiles) {
      // Note: In a real app, this would be handled by a storage service
      await new Promise((r) => setTimeout(r, 400));
    }

    // TODO: Replace with actual Firebase Storage upload + RAG call
    await new Promise((r) => setTimeout(r, 800));

    setIsGenerating(false);
    setFiles([]); // Clear after simulation
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out both; }

        body { font-family: 'Outfit', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* ── Page wrapper ── */}
      <div className='min-h-screen bg-[#11111b] flex flex-col items-center justify-center px-4 py-10'>
        <div className='flex items-center gap-3 mb-6'>
          <Image
            src="/thinkstack_logo_1024.png"
            alt="Logo"
            width={128}
            height={128}
          />
          {/* <h1 className='text-xl font-bold bg-gradient-to-r from-[#89b4fa] to-[#74c7ec] bg-clip-text text-transparent'>
            ThinkStack
          </h1> */}
        </div>
        {/* ── Header label ── */}
        <div className='mb-6 text-center animate-fade-in'>
          <p className='text-[#89b4fa]/70 text-xs mono uppercase tracking-[0.2em] mb-1'>
            ThinkStack · AI Learner
          </p>
          <h1 className='text-[#cdd6f4] text-2xl font-semibold tracking-tight'>
            Ask anything from your documents
          </h1>
        </div>

        {/* ── Shared Input Component ── */}
        {/* <div className="w-full max-w-2xl">
          <CustomInput
            onSend={handleGenerate}
            isGenerating={isGenerating}
            placeholder="Ask a question, summarise, explain a concept…"
          />
        </div> */}

        {/* ── Helper text ── */}
        {/* <p className='mt-3 text-[11px] text-[#45475a] text-center animate-fade-in'>
          Shift + Enter for new line · Drag & drop files directly · Enter to
          send
        </p> */}
      </div>
    </>
  );
}
