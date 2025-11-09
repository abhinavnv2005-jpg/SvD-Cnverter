
import React, { useCallback } from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon, XIcon } from './icons';

interface ImageUploaderProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ files, setFiles }) => {

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const processedFiles: UploadedFile[] = await Promise.all(
        newFiles.map(async file => {
          const base64 = await fileToBase64(file);
          return {
            file,
            previewUrl: URL.createObjectURL(file),
            base64,
          };
        })
      );
      setFiles(prev => [...prev, ...processedFiles]);
    }
  }, [setFiles]);

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    URL.revokeObjectURL(fileToRemove.previewUrl);
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full p-4 border-2 border-dashed border-slate-600 rounded-lg text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-all duration-300">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
            <UploadIcon />
            <span className="text-slate-400">Click to upload or drag and drop</span>
            <span className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</span>
        </label>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((uploadedFile, index) => (
            <div key={index} className="relative group">
              <img
                src={uploadedFile.previewUrl}
                alt={`preview ${index}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-black/50 hover:bg-red-500/80 rounded-full p-1 text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <XIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
