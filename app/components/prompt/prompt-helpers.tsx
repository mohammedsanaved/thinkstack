'use client';

import React from 'react';

export type FileType = 'pdf' | 'docx' | 'excel' | 'other';
export const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.csv';


export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress?: number;
}

export function getFileType(file: File): FileType {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv'))
    return 'excel';
  return 'other';
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${((bytes / 1024)).toFixed(1)} KB`;
  return `${((bytes / (1024 * 1024))).toFixed(1)} MB`;
}

export function FileIcon({ type, size = 14 }: { type: FileType; size?: number }) {
  const configs: Record<FileType, { bg: string; label: string; text: string }> =
    {
      pdf: { bg: '#EF4444', label: 'PDF', text: 'white' },
      docx: { bg: '#3B82F6', label: 'DOC', text: 'white' },
      excel: { bg: '#22C55E', label: 'XLS', text: 'white' },
      other: { bg: '#8B5CF6', label: 'FILE', text: 'white' },
    };

  const c = configs[type];

  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.text,
        fontSize: size - 4,
        fontWeight: 700,
        borderRadius: 4,
        padding: '1px 4px',
        letterSpacing: '0.04em',
        lineHeight: 1,
        fontFamily: 'monospace',
        flexShrink: 0,
      }}
    >
      {c.label}
    </span>
  );
}

export function FileChip({
  file,
  onRemove,
}: {
  file: AttachedFile;
  onRemove: (id: string) => void;
}) {
  return (
    <div className='group flex items-center gap-1.5 bg-[#1e1e2e] border border-[#313149] rounded-lg px-2.5 py-1.5 text-sm text-[#cdd6f4] transition-all duration-200 hover:border-[#89b4fa]/60 hover:bg-[#252540] animate-chip-in max-w-[200px]'>
      <FileIcon type={file.type} />
      <span className='truncate font-medium text-xs text-[#cdd6f4]/90 max-w-[110px]'>
        {file.name}
      </span>
      <span className='text-[10px] text-[#6c7086] shrink-0'>
        {formatSize(file.size)}
      </span>
      <button
        onClick={() => onRemove(file.id)}
        className='ml-0.5 rounded-full p-0.5 text-[#6c7086] hover:text-[#f38ba8] hover:bg-[#f38ba8]/10 transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0'
        aria-label={`Remove ${file.name}`}
      >
        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round'>
          <path d='M2 2l6 6M8 2l-6 6' />
        </svg>
      </button>
    </div>
  );
}
