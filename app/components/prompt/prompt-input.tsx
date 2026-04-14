'use client';

import React, { useState } from 'react';
import CustomInput from './custom-input';
import { AttachedFile } from './prompt-helpers';

export default function PromptInput() {
  const [uploading, setUploading] = useState(false);

  const handleGenerate = async (prompt: string, files: AttachedFile[]) => {
    if (!prompt.trim() && files.length === 0) return;

    setUploading(true);
    console.log('Sending prompt:', prompt);
    console.log('Files:', files);

    // Simulate upload/processing
    await new Promise(r => setTimeout(r, 1000));

    setUploading(false);
  };

  return (
    <div className="w-full">
      <CustomInput
        onSend={handleGenerate}
        isGenerating={uploading}
        placeholder="Write your prompt..."
      />
    </div>
  );
}
// );
// }
