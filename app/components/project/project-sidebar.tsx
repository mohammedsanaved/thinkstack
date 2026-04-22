'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Plus, FileText, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProjectFiles } from '@/app/lib/firebase/project-file-service';
import { formatSize, FileIcon, getFileType, ACCEPTED_FILE_TYPES } from '../prompt/prompt-helpers';

interface ProjectSidebarProps {
  projectId: string;
}

export default function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const data = await getProjectFiles(projectId);
        setFiles(data);
      } catch (err) {
        console.error("Failed to fetch project files:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [projectId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    try {
      const res = await fetch('/api/project_files', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const newFile = await res.json();
      setFiles((prev) => [newFile, ...prev]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to remove this file from the project?")) return;

    try {
      const res = await fetch(`/api/project_files?fileId=${fileId}&projectId=${projectId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Delete failed");

      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete file.");
    }
  };

  return (
    <aside className="w-[380px] flex flex-col gap-6 min-h-0">
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
      <div className="bg-[#1e1e2e]/40 border border-[#2a2a45] rounded-3xl p-6 flex-1 flex flex-col min-h-0 transition-colors hover:border-[#89b4fa]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-lg">Files</h3>
          <div className="flex items-center gap-2">
            {uploading && <Loader2 className="w-4 h-4 text-[#89b4fa] animate-spin" />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="h-8 w-8 text-[#8b8b8b] hover:text-white hover:bg-white/5"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleUpload}
          className="hidden"
        />

        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#89b4fa] animate-spin" />
            </div>
          ) : files.length === 0 ? (
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
          ) : (
            <div className="space-y-3 pr-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group flex items-center justify-between bg-[#11111b] border border-[#2a2a45] rounded-xl px-4 py-3 hover:border-[#89b4fa]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileIcon type={getFileType({ name: file.name } as File)} size={16} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-[#cdd6f4] truncate max-w-[140px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-[#6c7086]">
                        {formatSize(file.size)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 text-[#6c7086] hover:text-[#f38ba8] hover:bg-[#f38ba8]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
