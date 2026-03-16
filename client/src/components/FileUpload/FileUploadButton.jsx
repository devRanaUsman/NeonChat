import React, { useRef } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { fileValidationLimits } from '../../utils/fileHelpers';

const FileUploadButton = ({ onFileSelect, onError }) => {
  const fileInputRef = useRef(null);

  // Fallback to local toast if we don't pass useNotifications locally
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > fileValidationLimits.maxSize) {
      if (onError) onError('File too large. Maximum size is 25MB');
      e.target.value = '';
      return;
    }

    if (!fileValidationLimits.allowedTypes.includes(file.type)) {
      if (onError) onError('File type not supported');
      e.target.value = '';
      return;
    }

    onFileSelect(file);
    e.target.value = ''; // Reset
  };

  return (
    <>
      <button 
        type="button" 
        onClick={handleClick}
        className="p-2.5 hover:bg-[#00C2FF]/10 rounded-xl transition-all"
        title="Attach File"
      >
        <svg className="w-5 h-5 text-[#F0F4F8]/50 hover:text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        accept={fileValidationLimits.allowedTypes.join(',')}
        multiple={false}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default FileUploadButton;
