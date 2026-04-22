'use client';

// import React from 'react';
import CustomInput from '../prompt/custom-input';
// import { AttachedFile } from '../prompt/prompt-helpers';

export default function ProjectInput({ 
  onSend, 
  onStop, 
  isGenerating 
}: { 
  onSend: (prompt: string, files: any[]) => void;
  onStop?: () => void;
  isGenerating?: boolean;
}) {
  return (
    <CustomInput
      onSend={(prompt, files) => onSend(prompt, files)}
      onStop={onStop}
      isGenerating={isGenerating}
      placeholder="How can I help you today?"
      disableFileUpload={true}
    >
      {/* <div className="flex items-center bg-[#11111b] border border-[#2a2a45] rounded-xl px-3 py-1.5 text-[#8b8b8b] text-sm cursor-pointer hover:bg-[#1e1e2e] transition-colors">
        <span>Sonnet 4.6</span>
        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div> */}
    </CustomInput>
  );
}

