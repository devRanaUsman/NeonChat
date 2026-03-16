import React, { useEffect, useState } from 'react';
import { formatBytes } from '../../utils/fileHelpers';

const FilePreviewBar = ({ file, uploadProgress, onCancel }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    // Create a local blob URL for images/videos preview before upload
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  if (!file) return null;

  const isImage = file.type.startsWith('image/');
  const ext = file.name.split('.').pop().toUpperCase();

  return (
    <div className="w-full bg-[#0A0F1E] border-t border-[#00C2FF]/20 p-3 animate-[slideUp_0.2s_ease-out]">
      <div className="flex items-center gap-3 relative">
        {isImage && previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-12 h-12 rounded-lg object-cover border border-[#00C2FF]/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] flex items-center justify-center text-[#0A0F1E] font-bold text-xs uppercase flex-shrink-0">
            {ext || 'FILE'}
          </div>
        )}

        <div className="flex-1 min-w-0 pr-10">
          <h4 className="text-[#F0F4F8] text-sm font-medium truncate">{file.name}</h4>
          <p className="text-[#F0F4F8]/50 text-xs flex items-center gap-2 mt-0.5">
            <span>{formatBytes(file.size)}</span>
            <span>&bull;</span>
            <span className="uppercase">{ext || 'FILE'}</span>
          </p>
          
          {uploadProgress > 0 && typeof uploadProgress === 'number' && (
            <div className="bg-[#111827] rounded-full h-1 w-full mt-2 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00C2FF] to-[#00FFD1] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        <button 
          onClick={onCancel}
          className="absolute right-0 top-1 text-[#F0F4F8]/40 hover:text-white transition-colors p-1"
          title="Cancel attachment"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FilePreviewBar;
