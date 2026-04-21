'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Send } from 'lucide-react';
import {
  AttachedFile,
  getFileType,
  FileChip,
  ACCEPTED_FILE_TYPES
} from './prompt-helpers';

interface CustomInputProps {
  onSend: (prompt: string, files: AttachedFile[]) => void;
  placeholder?: string;
  isGenerating?: boolean;
  className?: string;
  children?: React.ReactNode; // For extra layout elements (like model selector)
  maxChars?: number;
  disableFileUpload?: boolean;
}

export default function CustomInput({
  onSend,
  placeholder = 'Ask anything...',
  isGenerating = false,
  className = '',
  children,
  maxChars = 4000,
  disableFileUpload = false,
}: CustomInputProps) {
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [focusRing, setFocusRing] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    setCharCount(prompt.length);
  }, [prompt]);

  const addFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'].includes(ext ?? '');
    });

    const newFiles: AttachedFile[] = valid.map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: getFileType(f),
      file: f,
      status: 'pending',
    }));

    setFiles((prev) => {
      const names = new Set(prev.map((p) => p.name));
      return [...prev, ...newFiles.filter((f) => !names.has(f.name))];
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const handleSend = () => {
    if ((!prompt.trim() && files.length === 0) || isGenerating) return;
    onSend(prompt, files);
    setPrompt('');
    setFiles([]);
  };

  const canSend = (prompt.trim().length > 0 || files.length > 0) && !isGenerating;

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={dropZoneRef}
        onDragOver={(e) => { 
          if (disableFileUpload) return;
          e.preventDefault(); 
          setIsDragging(true); 
        }}
        onDragLeave={(e) => {
          if (disableFileUpload) return;
          if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={(e) => {
          if (disableFileUpload) return;
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
        }}
        className={`
          relative w-full rounded-2xl border transition-all duration-300 bg-[#1a1a2e]
          ${isDragging ? 'border-[#89b4fa] shadow-[0_0_0_3px_rgba(137,180,250,0.15)] scale-[1.01]' :
            focusRing ? 'border-[#89b4fa]/50 shadow-[0_0_0_3px_rgba(137,180,250,0.08)]' : 'border-[#2a2a45]'}
        `}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className='absolute inset-0 z-10 rounded-2xl bg-[#89b4fa]/5 flex flex-col items-center justify-center gap-2 pointer-events-none'>
            <Plus className='w-8 h-8 text-[#89b4fa]' />
            <p className='text-[#89b4fa] text-sm font-medium'>Drop files here</p>
          </div>
        )}

        {/* File chips row */}
        {files.length > 0 && (
          <div className='px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-[#2a2a45]'>
            {files.map((f) => (
              <FileChip key={f.id} file={f} onRemove={removeFile} />
            ))}
          </div>
        )}

        {/* Textarea */}
        <div className='px-4 pt-3 pb-2'>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={() => setFocusRing(true)}
            onBlur={() => setFocusRing(false)}
            placeholder={placeholder}
            rows={1}
            maxLength={maxChars}
            className='
              w-full bg-transparent resize-none outline-none
              text-[#cdd6f4] text-[15px] font-light leading-relaxed
              placeholder:text-[#45475a]
              min-h-[44px]
            '
          />
        </div>

        {/* Toolbar row */}
        <div className='flex items-center justify-between px-3 pb-3 pt-1'>
          <div className='flex items-center gap-2'>
            {!disableFileUpload && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="icon"
                title='Attach files'
                className='h-9 w-9 text-[#7f849c] hover:text-[#89b4fa] hover:bg-[#89b4fa]/8 rounded-lg transition-all cursor-pointer'
              >
                <Plus className="w-5 h-5" />
              </Button>
            )}

            {/* Optional extra elements like Model Selector */}
            {children}
          </div>

          <div className='flex items-center gap-3'>
            {prompt.length > maxChars * 0.8 && (
              <span className={`text-[10px] mono ${charCount >= maxChars ? 'text-[#f38ba8]' : 'text-[#fab387]'}`}>
                {charCount}/{maxChars}
              </span>
            )}

            <Button
              onClick={handleSend}
              disabled={!canSend}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                ${canSend
                  ? 'bg-[#89b4fa] text-[#11111b] hover:bg-[#b4d0fa] shadow-[0_2px_12px_rgba(137,180,250,0.3)]'
                  : 'bg-[#1e1e2e] text-[#45475a] border border-[#2a2a45] cursor-not-allowed'}
              `}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <span>Generate</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        <Input
          ref={fileInputRef}
          type='file'
          accept={ACCEPTED_FILE_TYPES}
          multiple
          onChange={handleFileInput}
          className='hidden'
        />
      </div>
    </div>
  );
}
