'use client'

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface CustomUploadProps {
  label: string;
  instructions: string;
  onFileSelect: (url: string) => void;
  currentValue?: string;
}

export const CustomUpload: React.FC<CustomUploadProps> = ({
  label,
  instructions,
  onFileSelect,
  currentValue,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(url);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(url);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-[13px] font-sans font-medium text-white/60">Anexo de Mídia</span>
      <div
        id="upload-box-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full bg-[#121815] rounded-[10px] p-[12px] flex flex-col items-center justify-center gap-[6px] border border-white/5 hover:border-[#ccff00]/20 transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="hidden-file-input"
        />

        {previewUrl ? (
          /* When images or videos are attached, remove all internal elements and fill the box with the first file thumbnail */
          <div className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden group">
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={triggerSelect}
                className="bg-[#ccff00] text-black text-[11px] px-3 py-1.5 rounded-lg font-sans font-bold hover:bg-white transition-colors"
              >
                Trocar Imagem
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  onFileSelect('');
                }}
                className="bg-red-600 text-white text-[11px] px-3 py-1.5 rounded-lg font-sans font-medium hover:bg-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 border border-[#ccff00]/20">
              <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
            </div>
          </div>
        ) : (
          /* Default state containing preview box + upload button with 6px gap */
          <>
            {/* Preview Box - Elements vertically centered: icon + label + instructions */}
            <div className="flex flex-col items-center justify-center text-center space-y-1">
              {/* Icon: square 70px, color #000, opacity 72% */}
              <div 
                className="w-[70px] h-[70px] flex items-center justify-center text-[#ccff00] opacity-80"
                style={{ width: '70px', height: '70px' }}
              >
                <UploadCloud className="w-14 h-14 stroke-1.5" />
              </div>
              
              {/* Label: 16px, bold, color #000 */}
              <h3 className="text-[16px] font-sans font-bold text-[#ccff00] leading-tight">
                {label}
              </h3>
              
              {/* Instructions: regular, 14px, color #000, opacity 60% */}
              <p className="text-[14px] font-sans font-normal text-white/60 max-w-[240px] leading-normal">
                {instructions}
              </p>
            </div>

            {/* Upload Button: Primary buttons properties. Background: #000, Foreground: #FFF, centered, icon + text */}
            <button
              type="button"
              onClick={triggerSelect}
              className="mt-[6px] w-full bg-[#000000] text-[#FFFFFF] border border-white/10 font-sans font-bold text-[16px] py-[10px] px-4 rounded-[10px] flex items-center justify-center gap-[6px] hover:bg-zinc-900 active:scale-[0.98] transition-all"
            >
              <ImageIcon className="w-[24px] h-[24px] text-white shrink-0" style={{ width: '24px', height: '24px' }} />
              <span>Selecionar Arquivo</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
