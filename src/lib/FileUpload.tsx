import React, { useRef, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { normalizeMediaUrl } from './mediaUrl';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  hint?: string;
}

export default function FileUpload({
  value,
  onChange,
  label = 'File',
  accept = '.pdf,application/pdf',
  hint,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('uasa_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(normalizeMediaUrl(data.url));
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileUrl = normalizeMediaUrl(value);
  const fileName = fileUrl ? decodeURIComponent(fileUrl.split('/').pop() || 'Uploaded file') : '';

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>

      {fileUrl ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
          <FileText size={18} className="text-[#009900] flex-shrink-0" />
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 text-xs text-[#009900] hover:underline truncate"
          >
            {fileName}
          </a>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-1.5 text-gray-400 hover:text-[#009900] rounded-lg"
            title="Replace file"
          >
            <Upload size={16} />
          </button>
          <button
            type="button"
            onClick={clearFile}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`w-full border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 transition-all hover:border-[#009900]/40 hover:bg-green-50/30 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <Loader2 size={24} className="text-[#009900] animate-spin" />
          ) : (
            <FileText size={24} className="text-gray-300" />
          )}
          <span className="text-xs font-medium text-gray-400">
            {uploading ? 'Uploading...' : 'Click to upload file'}
          </span>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept={accept}
      />

      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}
